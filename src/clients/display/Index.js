const SIGNAL_SERVER_PORT = 9000;
let trackIDs = {};

const connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT,
	offerOnReady: false,
});

function onGetStreams (rtcPeerConnection) {
	let streams = rtcPeerConnection.getRemoteStreams();
	let streamIDs = {};

	// Find streamIDs for all availiable track
	streams.forEach(function (stream) {
		stream.getTracks().forEach(function (track) {
			streamIDs[track.id] = stream;
		});
	});
		
	// Display 360 video on browser
	let video360 = document.querySelector('#camera360');
	if (streamIDs[trackIDs['video360']]) {
		let trackID = trackIDs['video360'];
		let stream = streamIDs[trackID];
		video360.srcObject = stream;

		video360.onloadedmetadata = function(_) {
			video360.play().catch(function (error) {
		    	console.log(error)
			});
    	};
	}

	// Display regular video on browser
	let videoRegular = document.querySelector('#cameraRegular');
	if (streamIDs[trackIDs['videoRegular']]) {
		let trackID = trackIDs['videoRegular'];
		let stream = streamIDs[trackID];
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
			trackIDs[data.label] = data.trackID;
			onGetStreams(connection.rtcPeerConnection);
		}
	}
}