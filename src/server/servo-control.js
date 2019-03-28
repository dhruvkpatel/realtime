const SerialPort = require('serialport');
const WebSocket = require('ws');

const ARDUINO_VENDOR_ID = '1a86';

exports.spin = function(port) {
	
	let serialInit = getSerialPortName()
		.then(openSerialPort);

	let wsInit = openWebSocket(port);

	Promise.all([serialInit, wsInit]).then((values) => {
		let serial, socket;
		[serial, socket] = values;
		return pipeSocketAndSerial(serial, socket);
	})
	.catch(error => {
		console.error(error);
	});
}

function pipeSocketAndSerial(serial, socket) {
	return new Promise((resolve, reject) => {

		socket.on('message', function(message) { 
			try {
		    	data = JSON.parse(message); 
		    } catch (e) { 
		    	reject(new Error('Invalid JSON'));
		    } 

		    switch (data.type) {
		    	case 'control':
		    		let message = data.control;
		    		serial.write(message, error => {
		    			reject(new Error('Could not write to Serial'));
		    		});
		    		break;
		    }
		});  

		serial.on('data', (message) => {

			// TODO confirm serial response format
			socket.send(JSON.stringify({
				type: 'control',
				control: message
			}));
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
		})

		console.log('Servos connected.');
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