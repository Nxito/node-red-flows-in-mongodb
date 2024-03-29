var http = require('http');
var express = require("express");
var RED = require("node-red");
const fs = require('fs');
var app = express();

var mongoClient = require('./mongodb');


app.use("/",express.static("public"));
var server = http.createServer(app);
const settings = {
    httpAdminRoot: '/red',
    httpNodeRoot: '/',
    userDir: './app/',
    flowFile:'./app/flowsmgdb.json',
    functionGlobalContext: {} 
};


async function init() {


    const flows = await mongoClient.Get("myId")
    fs.writeFileSync( settings.flowFile, flows.flow||[0] )

    RED.events.on('runtime-event', (params) =>{
        if(params.id == "runtime-deploy"){
            console.log("_DEPLOY ! se guardaran en la base de datos por seguridad!_");
            var file = fs.readFileSync( settings.flowFile ,"utf8")
            mongoClient.Save("myId",file)
        }
    });

    RED.init(server, settings)
    app.use(settings.httpAdminRoot, RED.httpAdmin);
    app.use(settings.httpNodeRoot, RED.httpNode);


    const port = process.env.PORT || 3000;
    server.listen(port);

    RED.start().then(function() {
        console.log('Node-RED listo en http://localhost:' + port + settings.httpAdminRoot);
    });
};

init()