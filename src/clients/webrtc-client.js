const RTCCONFIG = {
	'iceServers': [{ 'url': 'stun:stun2.1.google.com:19302' }]
};

class Connection {

	constructor({
		room,
		hostname, 
		port, 
		offerOnReady, 
		onReceiveStream=function(stream) {}
	}) {
		let that = this;

		// Check browser compatibility
		if (!hasRTCPeerConnection()) {
			throw 'Browser does not support WebRTC (Video streaming)';
		}

		// Set up WebRTC Peer Connection & Handlers
		this.rtcPeerConnection = new webkitRTCPeerConnection(RTCCONFIG);
		this.rtcPeerConnection.onicecandidate = function (event) {
			if (event.candidate) {
				that.sendWS({
					type: 'candidate',
					candidate: event.candidate
				});
			}
		};

		// Set up media stream handler
		this.rtcPeerConnection.ontrack = function (event) {
			onReceiveStream(event.streams[0]);
		};


		// Set up WebSockets Signaling Server Connection & Handlers
		this.room = room;
		this.signalConnection = new WebSocket(`ws://${hostname}:${port}`);
		this.signalConnection.onmessage = function (message) {
			console.log('Got message:', message.data);

			let data = JSON.parse(message.data); 
			switch(data.type) { 
				case 'ready': 
					that._onReady(offerOnReady); 
					break; 
				case 'offer': 
					that._onOffer(data.offer); 
					break; 
				case 'answer': 
					that._onAnswer(data.answer); 
					break; 
				case 'candidate': 
					that._onCandidate(data.candidate); 
					break; 
				default: 
					break; 
			} 
		};

		// Broadcast room to Signal server (once connection is open)
		this.signalConnection.onopen = function (event) {
			console.log(that);
			that.sendWS({
				type: 'ready',
				room: that.room
			});
		};
		
	}

	addStream(stream) {
		let that = this;
		stream.getTracks().forEach(function (track) {
			that.rtcPeerConnection.addTrack(track, stream)
		});
		// this.rtcPeerConnection.addStream(stream);
	}

	// Sends JSON message to Signal Server
	sendWS(message) {
		this.signalConnection.send(JSON.stringify(message));
	}

	// When two clients enter the same room - one of them will make an offer
	_onReady(offerOnReady) {
		if (offerOnReady) {
			let that = this;

			this.rtcPeerConnection.createOffer(function (offer) {
				that.sendWS({
					type: 'offer',
					offer: offer
				});
				that.rtcPeerConnection.setLocalDescription(offer);
			}, function (error) {
				console.error('Cannot create WebRTC offer');
			});
		}
	}

	// When peer client sends an offer
	_onOffer(offer) {
		this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));

		let that = this;
		this.rtcPeerConnection.createAnswer(function (answer) {
			that.sendWS({
				type: 'answer',
				answer: answer
			});
			that.rtcPeerConnection.setLocalDescription(answer);
		}, function (error) {
			console.error('Cannot create WebRTC answer');
		});
	}

	// When peer client sends an answer
	_onAnswer(answer) {
		this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
	} 

	// When peer clients sends an ice candidate
	_onCandidate(candidate) {
		this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
	}
}

function hasRTCPeerConnection() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    return !!window.RTCPeerConnection;
}

function hasUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    return !!navigator.getUserMedia; 
}
