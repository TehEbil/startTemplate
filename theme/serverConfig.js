var serverConfig = {
    runOnServer: false
    /*
    mode: "http",
    ip: "127.0.0.1",
    port: "3006" 
    */
};

if(typeof module !== "undefined")
    module.exports.serverConfig = serverConfig;