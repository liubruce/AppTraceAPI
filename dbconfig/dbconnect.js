/**
 * Created by bruceliu on 16/8/24.
 */
var mongo = require('mongoskin');
var apmConfig = require('../config/config', 'dont-enclose');

var dbConnection = function(config) {
    var db;
    if(typeof config == "string"){
        db = config;
        config = apmConfig;
    }
    else
        config = config || apmConfig;

    var dbName;
    var dbOptions = {
        server:{poolSize: config.mongodb.max_pool_size, reconnectInterval: 100, socketOptions: { autoReconnect:true, noDelay:true, keepAlive: 1, connectTimeoutMS: 0, socketTimeoutMS: 0 }},
        replSet:{poolSize: config.mongodb.max_pool_size, reconnectInterval: 100, socketOptions: { autoReconnect:true, noDelay:true, keepAlive: 1, connectTimeoutMS: 0, socketTimeoutMS: 0 }},
        mongos:{poolSize: config.mongodb.max_pool_size, reconnectInterval: 100, socketOptions: { autoReconnect:true, noDelay:true, keepAlive: 1, connectTimeoutMS: 0, socketTimeoutMS: 0 }}
    };
    if (typeof config.mongodb === 'string') {
        dbName = db ? config.mongodb.replace(new RegExp('countly$'), db) : config.mongodb;
    } else{
        config.mongodb.db = db || config.mongodb.db || 'countly';
        if ( typeof config.mongodb.replSetServers === 'object'){
            //mongodb://db1.example.net,db2.example.net:2500/?replicaSet=test
            dbName = config.mongodb.replSetServers.join(',')+'/'+config.mongodb.db;
            if(config.mongodb.replicaName){
                dbOptions.replSet.replicaSet = config.mongodb.replicaName;
            }
        } else {
            dbName = (config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db);
        }
    }

    if(config.mongodb.dbOptions){
        dbOptions.db = config.mongodb.dbOptions;
    }

    if(config.mongodb.serverOptions){
        _.extend(dbOptions.server, config.mongodb.serverOptions);
        _.extend(dbOptions.replSet, config.mongodb.serverOptions);
        _.extend(dbOptions.mongos, config.mongodb.serverOptions);
    }

    if(config.mongodb.username && config.mongodb.password){
        dbName = config.mongodb.username + ":" + config.mongodb.password +"@" + dbName;
    }

    if(dbName.indexOf('mongodb://') !== 0){
        dbName = 'mongodb://'+dbName;
    }

    var apptraceDb = mongo.db(dbName, dbOptions);
    apptraceDb._emitter.setMaxListeners(0);
    if(!apptraceDb.ObjectID)
        apptraceDb.ObjectID = mongo.ObjectID;

    return apptraceDb;
};


module.exports = dbConnection(apmConfig);

