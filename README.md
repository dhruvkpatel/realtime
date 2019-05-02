# Real-time Robot Vision
----------------------
#### Duke University, Spring 2019
**Dhruv K. Patel   
Sachal Dhillon   
Guangshen Ma  
Ryan Connolly  
Raphael Kim**  

This is the source code for a real-time virtual-reality robotic vision system. The project was created by students for ECE590 at Duke University. [Read more about the project here.](https://github.com/dhruvkpatel/realtime/blob/master/doc/realtime.pdf)

Requirements
------------
* Computer that runs Windows, OS X, or Linux (to connect to camera rig)
* Oculus Go, Samsung Gear VR, or Desktop Computer (for displaying video streams remotely)

Setup
-----
1. Set up the **physical camera rig**:
	* **360 Camera:** Bolt the Theta V 360 camera to the top of the rig so that the pushbutton face is pointing towards the "front". Connect the Micro-USB cable to the camera. Connect the other end of the cable to the server computer using a USB extension cable. Once the 360 camera is on, set the 360 camera to **LIVE** mode.
	* **Webcam:** Connect the webcam to the computer via USB.
	* **Servo Control Box:** Connect the servo control box to the computer via the Mini-USB cable. Power the servo control box using the 5V power adapter. Flip the switch on. If the servo control box is ready, both the blue and red LEDs should be lit.
2. This project is built with **Node.js** and **npm**. On the computer intended to be attached to the camera rig, install both **Node.js** and **npm** at once [using this link](https://www.npmjs.com/get-npm).
3. Clone this repository:  
```shell
git clone https://github.com/dhruvkpatel/realtime.git
```
4. Navigate to the cloned repository. Then, start the servers using the following command:
```shell
npm start
```
5. Two links will be displayed on the terminal - one for each web page. Open the camera rig web page in Chrome or Firefox on the same computer. Using the drop-down menus, select the 360 Camera and the Webcam respectively. A view of the live feed should be displayed on the web page.
6. Boot up the Oculus Go. In the Oculus, navigate to the **Firefox Reality** browser. Navigate to the address of the display device web page. 

How to Use
----------
* Once the Oculus is set up and the video feeds are being received, point and click at the bottom right of the web page (goggles icon) to put it into full VR immersive mode. Look around.
* On the display web app, there are three views: Standard, Zoomed, and 360 Only. Press the trigger on the Oculus controller to toggle between the views.
	1. **Standard Mode**: In the foreground, a small view of the regular webcam follows your view. In the background, you can see the 360 video.
	2. **Zoomed Mode**: A zoomed view of the regular webcam follows your view. The 360 camera is not visible.
	3. **360 Only Mode**: The 360 camera is visible around you. The regular webcam is not visible.
* In both Standard in Zoomed mode, the regular webcam will follow your motion. Because the motion range of the webcam is limited by mechanical constraints, it will not follow when out of range. Instead, red arrows will appear on screen to point you back in range of the webcam.


Troubleshooting
---------------
* For general video streaming issues (the videos aren't being displayed on the VR device, the webcam and/or 360 camera are not available to be selected, etc.), try restarting the servers and refreshing the web pages. This fixes most issues.
* If the 360 camera does not appear as a webcam, make sure it is set to LIVE mode. If the problem persists, even after waiting for the computer to register the device, ensure that the 360 camera is connected directly to the computer (as opposed to on a USB hub with other devices). We have found the 360 camera to draw quite a bit of current and sometimes reset if it is not powered separately from other devices (this is just a theory).
* If `npm start` results in node error messages, trying using: `npm rebuild` to update node binaries. Then, proceed with `npm start`.
* If the display web page is not opening on the VR device, ensure that the server is running and that the device is connected to the same local network as the camera rig computer. Also, ensure that the *entire* web address is being typed into the browser. For example, ensure that "http://10.194.221.24:8888/" includes the "http" and the port number.




