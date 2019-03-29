const SIGNAL_SERVER_PORT = 9000;
const SERVO_SERVER_PORT = 9001;

// Open WebRTC connection
const connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT, 
	offerOnReady: true, 
});

// Open Channel to send video labels (to distinguish between 360 & regular streams) 
let videoLabelChannel;
let videoLabelChannelInit = new Promise(function (resolve, reject) {
	videoLabelChannel = connection.rtcPeerConnection.createDataChannel("Video Labels", {id: 0});
	videoLabelChannel.onopen = resolve;
});

// Open channel to recieve orientation data (from display device)
let servoControlChannelInit = new Promise((resolve, reject) => {
	channel = connection.rtcPeerConnection.createDataChannel("Orientation", {id: 1});
	channel.onopen = _ => {
		resolve(channel);
	};
});

// Open Web Socket to send orientation (to servo control server)
let servoControlSocketInit = new Promise((resolve, reject) => {
	let socket = new WebSocket(`ws://129.0.0.1:${SERVO_SERVER_PORT}/`);
	socket.onopen = _ => {
		resolve(socket);
	};
});
 
// Initialize 360 Video
let video360;
let video360Init = new Promise(function (resolve, reject) {
	video360 = new VideoStream('video360', 'camera360', connection);
	video360.onMid = resolve;
});

// Initialize Regular Video
let videoRegular;
let videoRegularInit = new Promise(function (resolve, reject) {
	videoRegular = new VideoStream('videoRegular', 'cameraRegular', connection);
	videoRegular.onMid = resolve;
});

function sendVideoMid(video, mid) {
	videoLabelChannel.send(JSON.stringify({
   		type: 'label',
   		label: video.label,
   		mid: mid
	}));
}

// Send video labels once videos and video label channels are initialized
Promise.all([videoLabelChannelInit, video360Init, videoRegularInit]).then(inputs => {
	sendVideoMid(video360, inputs[1].mid);
	sendVideoMid(videoRegular, inputs[2].mid)
	video360.onMid = send360ID;
	videoRegular.onMid = sendRegularID;
});

// Pipe servo streams in both directions once they are initialized
Promise.all([servoControlChannelInit, servoControlSocketInit]).then(inputs => {
	let displayStream, servoStream;
	[displayStream, servoStream] = inputs;

	displayStream.pipeTo(servoStream);
	servoStream.pipeTo(displayStream);
});