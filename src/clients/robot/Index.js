const SIGNAL_SERVER_PORT = 9000;

const connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT, 
	offerOnReady: true, 
});

let videoLabelChannel;
let dataChannelInit = new Promise(function (resolve, reject) {
	videoLabelChannel = connection.rtcPeerConnection.createDataChannel("Video Labels", {id: 0});
	videoLabelChannel.onopen = resolve;
});

let video360;
let video360Init = new Promise(function (resolve, reject) {
	video360 = new VideoStream('video360', 'camera360', connection);
	video360.onTrackID = resolve;
});

let videoRegular;
let videoRegularInit = new Promise(function (resolve, reject) {
	videoRegular = new VideoStream('videoRegular', 'cameraRegular', connection);
	videoRegular.onTrackID = resolve;
});

send360ID = function (trackID) {
	videoLabelChannel.send(JSON.stringify({
   		type: 'label',
   		label: video360.label,
   		trackID: trackID
	}));
}
Promise.all([dataChannelInit, video360Init]).then(function (trackID) {
	send360ID(trackID[1]);
	video360.onTrackID = send360ID;
});

sendRegularID = function (trackID) {
	videoLabelChannel.send(JSON.stringify({
   		type: 'label',
   		label: videoRegular.label,
   		trackID: trackID
	}));
}
Promise.all([dataChannelInit, videoRegularInit]).then(function (trackID) {
	sendRegularID(trackID[1]);
	videoRegular.onTrackID = sendRegularID;
});