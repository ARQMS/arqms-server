// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));
const mqtt = require('mqtt');
const stream = require('./stream/main')

const config = {
  // Configure Parse Core configuration
  // https://parseplatform.org/parse-server/api/master/ParseServerOptions.html
  appId: process.env.PARSE_APP_ID || 'arqms',
  appName: 'Air Room Management Server',
  publicServerURL: process.env.PARSE_SERVER_URI || 'http://localhost:1337/parse',
  masterKey: process.env.PARSE_MASTER_KEY || 'masterKey',
  serverURL: process.env.PARSE_SERVER_URI || 'http://localhost:1337/parse',
  allowClientClassCreation: true,
  startLiveQueryServer: true,
  
  // Setup mongodb databse
  databaseURI:  process.env.PARSE_DATABSE_URI || 'mongodb://root:root@localhost:27017/dev',
  
  // Cloud Webhooks
  cloud: __dirname + '/cloud/main.js', 

  // Flutter Web Bug
  // https://github.com/parse-community/Parse-SDK-Flutter/issues/500
  allowHeaders: ['X-Parse-Installation-Id'],
  
  // Live Query
  // https://docs.parseplatform.org/parse-server/guide/#live-queries
  liveQuery: {
      classNames: ["Room"]
  }
};

// MQTT service
if (!test) {
  const client = mqtt.connect("mqtt://mqtt-server");
  client.on('connect', function () {
    client.subscribe("devices/+/room/+");
    client.subscribe("devices/+/status");

    client.publish('devices/server/status', 'Server connected')
  });

  client.on("message", stream.handleMsg);
}

// Serve the Parse API on the /parse URL prefix
const app = express();
if (!test) {
  const api = new ParseServer(config);
  app.use('/parse', api);
}

if (!test) {
  const port = 1337;
  const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server running on port ' + port + '.');
  });
  var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);
}

module.exports = {
  app,
  config,
};
