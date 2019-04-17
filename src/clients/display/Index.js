const SIGNAL_SERVER_PORT = 9000;
let tranceiverMids = {};
let orientationChannel;
let canSendOrientation = false;
let rotationPollRateMS = 50;


// Replace ./data.json with your JSON feed
const getJSON = (fileName)=> fetch(fileName).then(response => {
  return response.json();
})
const servoParamsPromise = getJSON("ServoParameters.json")

const connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT,
	offerOnReady: false,
});

function onGetStreams (rtcPeerConnection) {
	let transceivers = rtcPeerConnection.getTransceivers();
	let midStreams = {};

	// Find midStreams for all availiable track
	transceivers.forEach(function (transceiver) {
		track = transceiver.receiver.track;
		midStreams[transceiver.mid] = new MediaStream([track]);
	});


	// Display 360 video on browser
	let video360 = document.querySelector('#camera360');
	if (midStreams[tranceiverMids['video360']]) {
		let mid = tranceiverMids['video360'];
		let stream = midStreams[mid];
		video360.srcObject = stream;

		video360.onloadedmetadata = function(_) {
			video360.play().catch(function (error) {
		    	console.log(error)
			});
    	};
	}

	// Display regular video on browser
	let videoRegular = document.querySelector('#cameraRegular');
	if (midStreams[tranceiverMids['videoRegular']]) {
		let mid = tranceiverMids['videoRegular'];
		let stream = midStreams[mid];
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

	switch (channel.label) {
		case 'Video Labels':
			channel.onmessage = event => {
				let data = JSON.parse(event.data);
				if (data.type === 'label') {
					tranceiverMids[data.label] = data.mid;
					onGetStreams(connection.rtcPeerConnection);
				}
			}
			break;
		case 'Orientation':
			channel.onmessage = event => {
				let data = JSON.parse(event.data);
				if (data.type === 'orientation') {
					onGotCameraOrientation(data.orientation)
				}
			};
			orientationChannel = channel;
			orientationChannel.onopen = _ => {
				canSendOrientation = true
			};
			break;
	}
}

/*
 * Calling this sends orientation of the display device to the robot
 * 
 * Note: When orientation data channel is open, 
 * 		 it will send desired orientation through.
 *    	 When unopened, it will do nothing
 */
function setDeviceOrientation(x, y, z) {
	if (canSendOrientation) {
		orientationChannel.send(JSON.stringify({
			type: 'orientation',
			orientation: {
				x: x,
				y: y,
				z: z
			}
		}));
	}
}

function onGotCameraOrientation(orientation) {
	console.log('feedback:', orientation);
	// Do logic that requires orientation feedback here.
}


 const adjustArrowsOpacity = (rotation, servoParams) => {

    let arrow_left = document.querySelector("#arrow_left");
    let arrow_right = document.querySelector("#arrow_right");
    let arrow_down = document.querySelector("#arrow_down");
    let arrow_up = document.querySelector("#arrow_up");

    let normalizedtilt = rotation.x + servoParams.tiltLimits.center
    let normalizedPan = (rotation.y + servoParams.panLimits.center) % 360
    normalizedPan = normalizedPan < 0 ? normalizedPan + 360 : normalizedPan

    const dist = (a,b) => Math.abs(a-b)

    let arrow_left_opacity = 0
    let arrow_right_opacity = 0
    let arrow_down_opacity = 0
    let arrow_up_opacity = 0
    const maxOpacityOffset = 50
    
    if(normalizedtilt < servoParams.tiltLimits.min){ 
		let delta = dist(normalizedtilt, servoParams.tiltLimits.min)
		arrow_down_opacity = delta > maxOpacityOffset ? 1 : delta/maxOpacityOffset
    }
    
    if(normalizedtilt > servoParams.tiltLimits.max){
		let delta = dist(normalizedtilt, servoParams.tiltLimits.max)
		arrow_up_opacity = delta > maxOpacityOffset ? 1 : delta/maxOpacityOffset
	}

	if(normalizedPan > servoParams.panLimits.max || normalizedPan < servoParams.panLimits.min){
		let deltaMin = Math.min(dist(normalizedPan, servoParams.panLimits.min), dist(normalizedPan - 360, servoParams.panLimits.min))
		
		let deltaMax = Math.min(dist(normalizedPan, servoParams.panLimits.max), dist(normalizedPan + 360, servoParams.panLimits.max))

		if(deltaMin < deltaMax){
			arrow_right_opacity = deltaMin > maxOpacityOffset ? 1 : deltaMin/maxOpacityOffset
		}
		else{
			arrow_left_opacity = deltaMax > maxOpacityOffset ? 1 : deltaMax/maxOpacityOffset
		}
	}
  arrow_down.setAttribute('opacity', arrow_down_opacity)
	arrow_up.setAttribute('opacity', arrow_up_opacity)
	arrow_left.setAttribute('opacity', arrow_left_opacity)
	arrow_right.setAttribute('opacity', arrow_right_opacity)
  }

  setInterval(()=>{ 
			let rotation = document.querySelector('#mainCam').getAttribute('rotation')
			setDeviceOrientation(rotation['x'],rotation['y'],rotation['z'])
			servoParamsPromise.then(servoParams => {adjustArrowsOpacity(rotation,servoParams)})
		},
		rotationPollRateMS);


