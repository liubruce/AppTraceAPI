var apmConfig = {
    mongodb: {
        host: "localhost",
        db: "lingcloudapm",
        port: 27017,
        max_pool_size: 10,
        //username: test,
        //password: test,
        /*
        dbOptions:{
            //db options
            native_parser: true
        },
        serverOptions:{
            //server options
            ssl:false
        }
        */
    },
    /*  or for a replica set
    mongodb: {
        replSetServers : [
            '192.168.3.1:27017',
            '192.168.3.2:27017'
        ],
        db: "countly",
		replicaName: "test",
		username: test,
		password: test,
        max_pool_size: 10,
        dbOptions:{
            //db options
            native_parser: true
        },
        serverOptions:{
            //server options
            ssl:false
        }
    },
    */
    /*  or define as a url
	//mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
	mongodb: "mongodb://localhost:27017/countly",
    */
    api: {
        port: 3001,
        host: "localhost",
        max_sockets: 1024
    },
    web: {
        port: 6001,
        host: "localhost",
        use_intercom: false
    },
	path: "",
	cdn: "",
    logging: {
        info: ["jobs", "push"],
        default: "warn"
    }
};

module.exports = apmConfig;