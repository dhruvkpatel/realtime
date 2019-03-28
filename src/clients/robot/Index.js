const SIGNAL_SERVER_PORT = 9000;

// Open WebRTC connection
const connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT, 
	offerOnReady: true, 
});

// Open Channel to send video data
let videoLabelChannel;
let videoLabelChannelInit = new Promise(function (resolve, reject) {
	videoLabelChannel = connection.rtcPeerConnection.createDataChannel("Video Labels", {id: 0});
	videoLabelChannel.onopen = resolve;
});

// let servoControlChannel;
// let servoControlChannelInit = new Promise((resolve, reject) => {
// 	servoControlChannel = 
// });
 
// Initialize 360 Video
let video360;
let video360Init = new Promise(function (resolve, reject) {
	video360 = new VideoStream('video360', 'camera360', connection);
	video360.onTrackID = resolve;
});

// Initialize Regular Video
let videoRegular;
let videoRegularInit = new Promise(function (resolve, reject) {
	videoRegular = new VideoStream('videoRegular', 'cameraRegular', connection);
	videoRegular.onTrackID = resolve;
});

function sendTrackID(video, trackID) {
	videoLabelChannel.send(JSON.stringify({
   		type: 'label',
   		label: video.label,
   		trackID: trackID
	}));
}

Promise.all([videoLabelChannelInit, video360Init, videoRegularInit]).then((inputs) => {
	sendTrackID(video360, inputs[1]);
	video360.onTrackID = send360ID;

	sendTrackID(videoRegular, inputs[2]);
	videoRegular.onTrackID = sendRegularID;
});