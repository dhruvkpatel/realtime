/**
 * Servo Control Library
 * 
 * Controls servo device given a goal orientation; 
 * Used by "servo-device.js"
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
 * 
 * 	@author: Dhruv K Patel
 * 	@author: Sachal Dhillon
 * 	@author: Guangshen Ma
 */
class ServoController {

	constructor() {
		this.active = false;
		this.servoUpdateHandler = (angle0, angle1) => {throw "Cannot set servo before handler is attached"};
		this.goalOrientation = {x: undefined, y: undefined, z: undefined};
		this.currentOrientation = {x: undefined, y: undefined, z: undefined};

		this.panLimits = {
			center: 80,
			min: 30,
			max: 129
		};

		this.tiltLimits = {
	        center: 73,
	        min: 30,
	        max: 105
    	};

		this.servoStretching = 0.55;
	}

	onServoUpdate(callback) {
		this.servoUpdateHandler = callback;
		this.setGoal({x: 0, y: 0});
	}

	setGoal(orientation) {
		function mod180(x) {
			while (x >= 180) {
				x -= 360;
			}
			while (x < -180) {
				x += 360;
			}
			return x;
		}

		function limitTo(x, min, max) {
			if (x > max) {
				return max;
			}
			else if (x < min) {
				return min;
			}
			return x;
		}

		this.goalOrientation = {
			x: mod180(orientation.x),
			y: mod180(orientation.y)
		}

		let panAngle = limitTo(this.panLimits.center - (this.goalOrientation.y) * this.servoStretching, this.panLimits.min, this.panLimits.max);
		let tiltAngle = limitTo(this.tiltLimits.center + (this.goalOrientation.x) * this.servoStretching, this.tiltLimits.min, this.tiltLimits.max);

	 	this._setServos(panAngle, tiltAngle);

	 	// console.log(`Goal: ${Math.round(this.goalOrientation.y)}, ${Math.round(this.goalOrientation.x)} | Servos: ${Math.round(panAngle)}, ${Math.round(tiltAngle)}`);
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