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
	}

	onServoUpdate(callback) {
		this.servoUpdateHandler = callback;
	}

	setGoal(orientation) {
		this.goalOrientation = orientation;

	 	let angle0 = orientation.y;
	 	let angle1 = orientation.x;

	 	this._setServos(angle0, angle1);
	 	this.setState(angle0, angle1);

		// TODO
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
		this.servoUpdateHandler(angle0.toFixed(0), angle1.toFixed(0));
	}
}

module.exports = ServoController;