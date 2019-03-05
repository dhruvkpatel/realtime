const SIGNAL_SERVER_PORT = 9000;

const robotVideoSelect = document.querySelector('.robot>select');
robotVideoSelect.onchange = getStream;

let connection;

// BUG: stream only works when robot creates offer
connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT, 
	offerOnReady: true, 
});

navigator.mediaDevices.enumerateDevices()
	.then(onGotDevices)
	.then(getStream)
	.catch(handleError);

/**
 *  Callback for retrieving list of availible devices from OS
 */
function onGotDevices(deviceInfos) {
	for (let i = 0; i !== deviceInfos.length; ++i) {
		const deviceInfo = deviceInfos[i];

		if (deviceInfo.kind === 'audioinput') {
			continue;
		}
	
		const option = document.createElement('option');
		option.value = deviceInfo.deviceId;
	
		if (deviceInfo.kind && deviceInfo.kind === 'videoinput') {
		  option.text = deviceInfo.label || 'Camera ' + (robotVideoSelect.length + 1);
		  robotVideoSelect.appendChild(option);
		}
  	}
}

/**
 *  Callback for getting camera stream once device is known
 */
function getStream() {
 	if (window.stream) {
		window.stream.getTracks().forEach(function(track) {
			track.stop();
		});
 	}

  	const constraints = {
		audio: false,
		video: {
		  	deviceId: {exact: robotVideoSelect.value}
		}
  	};

  	navigator.mediaDevices.getUserMedia(constraints)
		.then(onGotStream)
		.catch(handleError);
}

/**
 *  Callback for setting up video in local browser once stream is availible
 */
function onGotStream(stream) {
	// Make stream availible on console
	window.stream = stream;

	// Display video on browser
	let video = document.querySelector('.robot>video');

  	if ("srcObject" in video) {
      	video.srcObject = stream;
    } 
    else {
    	// Older browsers may not have srcObject
     	video.src = window.URL.createObjectURL(stream);
    }

    video.onloadedmetadata = function(_) {
    	video.play();
    };

    // Stream video
    connection.addStream(stream);
}

function handleError(error) {
  	console.error('Error: ', error);
}