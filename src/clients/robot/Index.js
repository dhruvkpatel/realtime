const SIGNAL_SERVER_PORT = 9000;

const connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT, 
	offerOnReady: true, 
});

class VideoStream {

	constructor(streamLabel, objectClass, rtcConnection) {
		this.label = streamLabel;
		this.objectClass = objectClass;
		this.connection = rtcConnection;
		this.rtpSender = undefined;
		this.trackID = undefined;

		this.videoDisplay = document.querySelector(`.${this.objectClass}>video`);
		this.videoSelect =  document.querySelector(`.${this.objectClass}>select`);

		// Manual stream selection
		this.videoSelect.onchange = () => this.getStream();

		// List devices & initially pick first one
		navigator.mediaDevices.enumerateDevices()
			.then((deviceInfos) => this.onGotDevices(deviceInfos))
			.then(() => this.getStream())
			.catch(this.handleError);
	}

	/**
	 *  Callback for retrieving list of availible devices from OS
	 */
	onGotDevices(deviceInfos) {
		for (let i = 0; i < deviceInfos.length; i++) {
			const deviceInfo = deviceInfos[i];
		
			if (deviceInfo.kind === 'videoinput') {
				const option = document.createElement('option');
				option.value = deviceInfo.deviceId;
				option.text = deviceInfo.label || 'Camera ' + (this.videoSelect.length + 1);
			 	this.videoSelect.appendChild(option);
			}
	  	}
	}

	/**
	 *  Callback for getting camera stream once device is known
	 */
	getStream() {
	 	// Remove old track if one exists
	 	if (this.rtpSender) {
	 		this.connection.rtcPeerConnection.removeTrack(this.rtpSender);
	 	}

	  	const constraints = {
			audio: false,
			video: {
			  	deviceId: {exact: this.videoSelect.value}
			}
	  	};

	  	navigator.mediaDevices.getUserMedia(constraints)
			.then((stream) => this.onGotStream(stream));
	}

	/**
	 *  Callback for setting up video in local browser once stream is availible
	 */
	onGotStream(stream) {
		window.stream = stream;

	  	if ("srcObject" in this.videoDisplay) {
	      	this.videoDisplay.srcObject = stream;
	    } 
	    else {
	    	// Older browsers may not have srcObject
	     	this.videoDisplay.src = window.URL.createObjectURL(stream);
	    }

	    this.videoDisplay.onloadedmetadata = () => this.videoDisplay.play();

	    // Stream video
	   	let track = stream.getTracks()[0];
	   	this.rtpSender = this.connection.rtcPeerConnection.addTrack(track, stream);
	}

	handleError(error) {
		console.log(error);
	}
}


let video360 = new VideoStream('video_360', 'v360', connection);