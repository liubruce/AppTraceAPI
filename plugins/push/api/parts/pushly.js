'use strict';

var crypto = require('crypto'),
    merge = require('merge');

/**
 * ENUM for message statuses.
 */
var Status = {
    Initial:        0,          // 0  Nothing happened yet
    InQueue:        1 << 1,     // 2  Master level
    InProcessing:   1 << 2,     // 4  Worker level
    Done:           1 << 3,     // 8  Done on worker level
    Error:          1 << 4,     // 16 Some error occurred during processing
    Aborted:        1 << 5,     // 32 Unrecoverable (credentials or message format) error occurred, or you just send message abort request
};

/**
 * ENUM for supported platforms.
 */
var Platform = {
    APNS: 'i',
    GCM: 'a'
};

//new Message({
//    content: {
//        message: 'Hello world!',
//        messagePerLocale: {
//            'de': 'Das ist fantastish',
//            'en_US': 'Wassup?',
//            'en_UK': 'Good day, Sir.',
//        }
//    },
//    devices: ['aasdfasdfkjsajhgdsjhdjasd', 'aljsdgfkwgef'],
//    devicesQuery: {
//        some: 'query object',
//        which: 'will Pushly will supply',
//        to: 'QueryStreamer().stream(devicesQuery)',
//        supplied: 'by you and which will return stream of device ID strings'
//    },
//});

var flattenObject = function(ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) === 'object' && ob[i] !== null) {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};

/**
 *
 */
var Message = function (opts) {
    opts = opts || {};
    opts.content = opts.content || {};

    if (!opts.id) { throw new Error('Message object must have unique ID in "id" key'); }

    // Common part
    this.id = opts.id;
    this.result = opts.result || {
        status: Status.Initial,
        total: 0,
        processed: 0,
        sent: 0,
        error: undefined,
    };
    this.expiryDate = opts.expiryDate ?
                            new Date(opts.expiryDate) :
                            new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);     // one week by default

    // Credentials part
    this.credentials = {};

    var cred = opts.credentials;
    if (!cred.platform) { throw new Error('Message object must have credentials with "platform" key'); }
    if (cred.platform === Platform.APNS) {
        if (!cred.key) { throw new Error('APNS Message object must have "key" key containing key file path'); }
        else if (typeof cred.key === 'string') {
            this.credentials.key = cred.key;
            if (cred.passphrase) { this.credentials.passphrase = cred.passphrase; }
        } else {
            throw new Error('APNS Message object must have "key" key containing key file path');
        }
        this.credentials.gateway = cred.gateway;
        this.credentials.port = cred.port;
    } else if (cred.platform === Platform.GCM) {
        if (!cred.key) { throw new Error('GCM Credentials object must have ProjectID in "key" key'); }
        this.credentials.key = cred.key;
    } else { throw new Error('Credentials "platform" must contain either Platform.APNS or Platform.GCM value'); }
    this.credentials.platform = cred.platform;
    this.credentials.id = cred.id;

    // Devices part
    if (opts.devices) {
        if (opts.devices.length) {
            this.devices = opts.devices;
        } else {
            throw new Error('Message must have non-empty array of devices or devicesQuery');
        }
    } else if (opts.devicesQuery) {
        this.devicesQuery = opts.devicesQuery;
    } else {
        throw new Error('Message must have array of devices or devicesQuery');
    }

    // Content part
    this.content = {
        encoding: opts.content.encoding || 'utf8',                          // Message encoding
        message: opts.content.message || undefined,                         // Simple message for all clients
        category: opts.content.category || undefined,                       // iOS 8 category
        messagePerLocale: opts.content.messagePerLocale || undefined,       // Map of locale => message for localized messages
        collapseKey: opts.content.collapseKey || undefined,                 // Collapse key for Android
        contentAvailable: opts.content.contentAvailable || undefined,       // content-available for iOS
        newsstandAvailable: opts.content.newsstandAvailable || undefined,   // newsstand-available for iOS
        delayWhileIdle: opts.content.delayWhileIdle || undefined,           // delay_while_idle for Android
        data: opts.content.data || undefined ,                              // Custom data

        sound: typeof opts.content.sound === 'undefined' ? undefined : opts.content.sound,
        badge: typeof opts.content.badge === 'undefined' ? undefined : opts.content.badge,
    };

    this.test = opts.test || false;

    Object.defineProperties(this, {
        key: {
            value: function() {
                return this.id + this.credentialsId();
            }
        },
        credentialsId: {
            value: function() {
                if (!this.credentials.id) {
                    var id = this.credentials.platform;
                    if (this.credentials.platform === Platform.GCM) {
                        id += this.credentials.key;
                    } else {
                        id += crypto.createHash('md5').update(this.credentials.key).digest('hex');
                    }
                    this.credentials.id = id;
                }
                return this.credentials.id;
            }
        },
        serialize: {
            value: function () {
                return this;
            }
        },
        prepareToken: {
            value: function (token) {
                return token;
            }
        },
        compileWithMessage: {
            value: function(platform, message) {
                var compiled;

                if (platform === Platform.APNS) {
                    compiled = {
                        aps: {},
                    };
                    if (message) {
                        compiled.aps.alert = message;
                    }
                    if (this.content.category) {
                        compiled.aps.category = this.content.category;
                    }
                    if (typeof this.content.sound !== 'undefined') {
                        compiled.aps.sound = this.content.sound;
                    }
                    if (typeof this.content.badge !== 'undefined') {
                        compiled.aps.badge = this.content.badge;
                    }
                    if (this.content.contentAvailable) {
                        compiled.aps['content-available'] = 1;
                    }
                    if (this.content.newsstandAvailable) {
                        compiled.aps['newsstand-available'] = 1;
                    }
                    if (this.content.data) {
                        merge(compiled, this.content.data);
                    }
                    return JSON.stringify(compiled);
                } else {
                    compiled = {};
                    if (this.content.collapseKey) {
                        compiled.collapse_key = this.content.collapseKey;
                    }

                    compiled.time_to_live = Math.round((this.expiryDate.getTime() - Date.now()) / 1000);
                    if (this.content.delayWhileIdle === true) {
                        compiled.delay_while_idle = true;
                    }

                    compiled.data = {};
                    if (message) {
                        compiled.data.message = message;
                    }
//                    compiled.c = JSON.stringify(this.content.data);
                    if (this.content.data) {
                        merge(compiled.data, flattenObject(this.content.data));
                    }
                    if (this.content.category) {
                        compiled.data['c.c'] = this.content.category;
                    }
                    return compiled;
                }

            }
        },
        compile: {
            value: function(platform) {
                var any;
                for (any in this.content.messagePerLocale);
                if (any) {
                    var content = {};
                    for (var locale in this.content.messagePerLocale) {
                        content[locale] = this.compileWithMessage(platform, this.content.messagePerLocale[locale]);
                    }
                    return content;
                } else {
                    return this.compileWithMessage(platform, this.content.message);
                }
            }
        }
    });
};

module.exports = {
    Status: Status,
    Message: Message,
    Platform: Platform,
};
