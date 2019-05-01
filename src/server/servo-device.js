/**
 * Servo Control Server
 *
 * Interface for servo device. Handles setup, including:
 *
 * 1. Opening serial connection with servo device
 * 2. Opening socket connection to receive orientation goals
 * 3. Initializing servo controller.
 *
 * Notes: 
 *
 *	Device Serial Protocol:
 *		To set servo state, controller will send: "g,SERVO_0_ANGLE,SERVO_1_ANGLE", e.g. "g,145,20"
 *		When device gives feedback, device will send: "f,SERVO_0_ANGLE,SERVO_1_ANGLE", e.g. "f,140,10"
 *
 * @author: Dhruv K Patel
 */

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
const WebSocket = require('ws');
// const ServoController = require('./servo-controller.js').ServoController;

const ServoController = require('./servo-controller.js');

const ARDUINO_VENDOR_ID = '1a86';

exports.spin = function(port) {
	
	let serialInit = getSerialPortName()
		.then(openSerialPort);

	let wsInit = openWebSocket(port);

	let controller = startServoController();

	Promise.all([serialInit, wsInit]).then((values) => {
		let serial, socket;
		[serial, socket] = values;
		return attachControllerToStreams(controller, serial, socket);
	})
	.catch(error => {
		console.error(error);
	});
}

function attachControllerToStreams(controller, serial, socket) {
	return new Promise((resolve, reject) => {

		// When controller wants to update servo device, communicate update through serial
		controller.onServoUpdate((angle0, angle1) => {
			// console.log(`g,${angle0},${angle1}`);
			serial.write(`g,${angle0},${angle1}`);
		});

		// When orientation command is received from display, update controller goal
		socket.on('message', function(message) { 
			// console.log('Display:', message);
			try {
				console.l
		    	data = JSON.parse(message); 

		    	if (data.type === 'orientation') {
		    		let orientation = data.orientation;
		    		// console.log(serial.isOpen);
		    		controller.setGoal(orientation);
		    	}
		    } catch (e) { 
		    	reject(e);
		    	reject(new Error('Invalid JSON'));
		    } 	    
		});  

		// When orientation feedback is received from servo device, 
		// 1. Update controller state
		// 2. Send controller's new orientation to display device
		const parser = new Readline();
		serial.pipe(parser);
		parser.on('data', message => {
			// console.log('Arduino:', message);
			let splitMessage = message.split(',');

			if (splitMessage[0] === 'f') {
				let angle0 = Number(splitMessage[1]);
				let angle1 = Number(splitMessage[2]);

				controller.setState(angle0, angle1);
				let newOrientation = controller.currentOrientation;

				socket.send(JSON.stringify({
					type: 'orientation',
					orientation: newOrientation
				}));
			}
		});
	});
}

function getSerialPortName() {
	return new Promise((resolve, reject) => {
		SerialPort.list()
			.then(portInfo => {

				// Return name of first port with Arduino nano vendor ID.
				// (assumes only one Arduino connected)
				let arduinoPort = portInfo.find(port => {
					return port.vendorId === ARDUINO_VENDOR_ID;
				});

				if (arduinoPort) {
					resolve(arduinoPort.comName);
				}
				else {
					reject(new Error('Servos not connected.'));
				}				
			})
	});
}

function openSerialPort(portName) {

	return new Promise((resolve, reject) => {
		let serial = new SerialPort(portName);
		
		serial.on('close', () => {
			reject(new Error('Servos disconnected.'));
		});

		serial.on('error', function(err) {
		  console.log('Error: ', err.message)
		});

		serial.on('close', function(err) {
			console.log('Error: ', err.message);
		});

		// console.log('Servos connected.');
		resolve(serial);
	});
}

function openWebSocket(port) {
	return new Promise((resolve, reject) => {
		wss = new WebSocket.Server({port: port}); 
		wss.on('connection', function(connection) {
			resolve(connection);
		});  
	});

}

function startServoController() {
	return new ServoController();
}