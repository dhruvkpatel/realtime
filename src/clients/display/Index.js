const SIGNAL_SERVER_PORT = 9000;

const connection = new Connection({
	room: 1,
	hostname: window.location.hostname,
	port: SIGNAL_SERVER_PORT,
	offerOnReady: false,
	onReceiveStream: onReceiveStream
});

// const videoEntity = document.querySelector('camera360entity');

function onReceiveStream(stream) {
  console.log("got stream");

	// Make stream availible on console
	window.stream = stream;

	// Display video on browser
	let video = document.querySelector('#camera360');

  	if ("srcObject" in video) {
      	video.srcObject = stream;
    } 
    else {
    	// Older browsers may not have srcObject
     	video.src = window.URL.createObjectURL(stream);
    }

    // video.src = window.URL.createObjectURL(stream);

    video.onloadedmetadata = function(_) {
        video.play().catch(function (error) {
            console.log(error)
        });

        // videoEntity.play();
    };
}