class VideoStream {

	constructor(streamLabel, objectID, rtcConnection, videoLabelChannel) {
		this.label = streamLabel;
		this.objectID = objectID;
		this.connection = rtcConnection;
		this.videoLabelChannel = videoLabelChannel;
		this.rtpTransceiver = undefined;
		this.onMid = function(){};

		this.videoDisplay = document.querySelector(`#${this.objectID} video`);
		this.videoSelect =  document.querySelector(`#${this.objectID} select`);

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
	    if (!this.rtpTransceiver) {
	    	this.rtpTransceiver = this.connection.rtcPeerConnection.addTransceiver(track);
	    }
	    else {
	    	this.rtpTransceiver.sender.replaceTrack(track);
	    }

		this.onMid(this.rtpTransceiver);	// This assumes transceiver is established before call-back. 
									// This is fishy, but it works.
	}

	handleError(error) {
		console.log(error);
	}
}