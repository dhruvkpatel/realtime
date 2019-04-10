const http = require('http');
const fs = require('fs');
const express = require('express');
const opn = require('opn');
const internalIp = require('internal-ip');
const signal = require('./server/signal.js');
const servo = require('./server/servo-device.js');

// const hostname = internalIp.v4.sync();
// const hostname = '127.0.0.1';
const root = __dirname;

console.log('---------------------------------------');
console.log('Welcome to the Real-Time Vision Project');
console.log('---------------------------------------\n');

/*
 * Servo Control server
 */
const servo_port = 9001;
servo.spin(servo_port);

/*
 * WebRTC Signaling server
 */
const signal_port = 9000;
signal.spin(signal_port);

/*
 * Robot-connected Web-App
 * Will run on browser of robot -- attached to cameras & servos
 */
const robot_app = express();
const robot_hostname = 'localhost';
const robot_port = 8889;

robot_app.get('/', (req, res) => {
	res.sendFile(root + '/clients/robot/Index.html');
});

robot_app.get('/Index.js', (req, res) => {
	res.sendFile(root + '/clients/robot/Index.js');
});

robot_app.get('/webrtc-client.js', (req, res) => {
	res.sendFile(root + '/clients/webrtc-client.js');
});

robot_app.get('/video-stream.js', (req, res) => {
	res.sendFile(root + '/clients/robot/video-stream.js');
});

robot_app.get('/')

robot_app.listen(robot_port, robot_hostname, () => {
	console.log('Open this webpage on the camera rig device:');
	console.log(`http://${robot_hostname}:${robot_port}/\n`);
});

// Automatically opens robot web page
// opn(`http://${robot_hostname}:${robot_port}/`);

/*
 * VR diplay Web-App 
 */
const display_app = express();
const display_hostname = internalIp.v4.sync();
const display_port = 8888;

display_app.get('/', (req, res) => {
	res.sendFile(root + '/clients/display/Index.html');
});

display_app.get('/Index.js', (req, res) => {
	res.sendFile(root + '/clients/display/Index.js');
});

display_app.get('/preload.js', (req, res) => {
	res.sendFile(root + '/clients/display/preload.js');
});

display_app.get('/webrtc-client.js', (req, res) => {
	res.sendFile(root + '/clients/webrtc-client.js');
});

display_app.listen(display_port, display_hostname, () => {
	console.log('Open this webpage on the VR display device:');
	console.log(`http://${display_hostname}:${display_port}/\n`);
});

// Automatically opens display web page (for debugging)
// opn(`http://${display_hostname}:${display_port}/`);