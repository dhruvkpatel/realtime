const SIGNAL_SERVER_PORT = 9000;
let tranceiverMids = {};

const connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT,
	offerOnReady: false,
});

function onGetStreams (rtcPeerConnection) {
	let transceivers = rtcPeerConnection.getTransceivers();
	let midStreams = {};

	// Find midStreams for all availiable track
	transceivers.forEach(function (transceiver) {
		track = transceiver.receiver.track;
		midStreams[transceiver.mid] = new MediaStream([track]);
	});


	// Display 360 video on browser
	let video360 = document.querySelector('#camera360');
	if (midStreams[tranceiverMids['video360']]) {
		let mid = tranceiverMids['video360'];
		let stream = midStreams[mid];
		video360.srcObject = stream;

		video360.onloadedmetadata = function(_) {
			video360.play().catch(function (error) {
		    	console.log(error)
			});
    	};
	}

	// Display regular video on browser
	let videoRegular = document.querySelector('#cameraRegular');
	if (midStreams[tranceiverMids['videoRegular']]) {
		let mid = tranceiverMids['videoRegular'];
		let stream = midStreams[mid];
		videoRegular.srcObject = stream;

		videoRegular.onloadedmetadata = function(_) {
			videoRegular.play().catch(function (error) {
			    console.log(error)
			});
    	};
	}    
}

connection.rtcPeerConnection.ontrack = function (event) {
	onGetStreams(connection.rtcPeerConnection);
}

connection.rtcPeerConnection.ondatachannel = function (event) {
	let channel = event.channel;
	channel.onmessage = function (event) {
		let data = JSON.parse(event.data);
		if (data.type === 'label') {
			tranceiverMids[data.label] = data.mid;
			onGetStreams(connection.rtcPeerConnection);
		}
	}
}