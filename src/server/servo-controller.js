/*
 * Controls servo device given a goal orientation
 *
 * Relies on the following assumptions
 *
 *  - Orientation follows A-frame coordinate system (roll, pitch, yaw w/ right-hand-rule):
 *    https://aframe.io/docs/0.9.0/components/position.html#sidebar
 *
 *  - Unit for angles is *degrees*
 *    
 * 	- Servo 0: controls pan & maps to orientation.y axis (positive angle = pan left)
 * 	- Servo 1: controls tilt & maps to orientation.x axis (positive angle = tilt up)
 * 	
 * 	- Orientation.z (yaw) axis is not controlled for
 */
class ServoController {

	constructor() {
		this.active = false;
		this.servoUpdateHandler = (angle0, angle1) => {throw "Cannot set servo before handler is attached"};
		this.goalOrientation = {x: undefined, y: undefined, z: undefined};
		this.currentOrientation = {x: undefined, y: undefined, z: undefined};

		this.panCenter = 80
		this.tiltCenter = 60
		this.panRange = 140 
		this.tiltRange = 105

		this.camera360Offset = {
			x: 0,
			y: -90
		};
	}

	onServoUpdate(callback) {
		this.servoUpdateHandler = callback;
		this._setServos(this.panCenter, this.tiltCenter)
	}

	setGoal(orientation) {
		this.goalOrientation = orientation;

	 	let panAngle = 	Math.max(Math.min(this.panRange - (orientation.y/2)%360 + this.camera360Offset.y + this.panCenter, this.panRange), 0);
	 	let tiltAngle = Math.max(Math.min((orientation.x/2)%360 + this.camera360Offset.x + this.tiltCenter, this.tiltRange), 0);

	 	this._setServos(panAngle, tiltAngle);

	 	console.log(`Goal: ${Math.round(orientation.y)}, ${Math.round(orientation.x)} | Servos: ${Math.round(panAngle)}, ${Math.round(tiltAngle)}`);
	}

	setState(angle0, angle1) {
		this.currentOrientation = {
			x: angle1, 
			y: angle0,
			z: 0
		};
	}

	_setServos(angle0, angle1) {
		// Convert to int, then send to device
		this.servoUpdateHandler(Math.round(angle0), Math.round(angle1));
	}
}

module.exports = ServoController;