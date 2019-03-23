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
	video360.onMid = resolve;
});

let videoRegular;
let videoRegularInit = new Promise(function (resolve, reject) {
	videoRegular = new VideoStream('videoRegular', 'cameraRegular', connection);
	videoRegular.onMid = resolve;
});

send360ID = function (mid) {
	videoLabelChannel.send(JSON.stringify({
   		type: 'label',
   		label: video360.label,
   		mid: mid
	}));
}
Promise.all([dataChannelInit, video360Init]).then(function (event) {
	let tranceiver = event[1];
	send360ID(tranceiver.mid);
	video360.onMid = send360ID;
});

sendRegularID = function (mid) {
	videoLabelChannel.send(JSON.stringify({
   		type: 'label',
   		label: videoRegular.label,
   		mid: mid
	}));
}
Promise.all([dataChannelInit, videoRegularInit]).then(function (event) {
	let tranceiver = event[1];
	sendRegularID(tranceiver.mid);
	videoRegular.onMid = sendRegularID;
});