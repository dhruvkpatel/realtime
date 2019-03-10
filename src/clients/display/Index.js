const SIGNAL_SERVER_PORT = 9000;

const connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT,
	offerOnReady: false,
});

connection.rtcPeerConnection.ontrack = (event) => onGetStreams(connection.rtcPeerConnection);

let stream360 = undefined;

function onGetStreams (rtcPeerConnection) {

	let streams = rtcPeerConnection.getRemoteStreams();
	stream360 = streams[0];

	// Display video on browser
	let video = document.querySelector('#camera360');

	if ("srcObject" in video) {
		video.srcObject = stream360;
	} 
	else {
		// Older browsers may not have srcObject
		video.src = window.URL.createObjectURL(stream);
	}

	video.onloadedmetadata = function(_) {
		video.play().catch(function (error) {
		    console.log(error)
		});
    };
}