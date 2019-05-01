/**
 *  VR App Preload
 *
 *  Handles additional front-end logic for VR webapp. Runs before "Index.js"
 * 
 *  @author: Sachal Dhillon
 *  @author: Dhruv K Patel
 */


AFRAME.registerComponent('rotation-reader', {
    init: function () {
      this.el.addEventListener('triggerdown', (evt) => toggleView(evt))
      this.el.addEventListener('click', (evt) => toggleView(evt))
      adjustArrowsToView();
    },
  });
  
  const toggleView = (evt) => {
    if(typeof this.code == 'undefined'){
      this.VIEW_STANDARD= "Standard View"
      this.VIEW_ZOOMED = "Zoomed View"
      this.VIEW_360 = "360 View"
      this.options = [this.VIEW_ZOOMED, this.VIEW_STANDARD, this.VIEW_360]
      this.code = this.options[this.options.length-1]
      this.ZOOM_SCALE_FACTOR = 1.75
    }
    if(this.code  === options[options.length-1]){
      this.code = options[0]
    }
    else{
      this.code = options[options.indexOf(this.code)+1]
    }
  
    const el = document.getElementById('mainCam')
    const cam = el.querySelectorAll(":scope a-video")[0];
    const videosphere = document.getElementById("camera360entity")
    const arrows = document.querySelectorAll('.directionalArrow')
    const sky = document.getElementById("sky")
    const curHeight = ()=>cam.getAttribute("height")
    const curWidth = ()=>cam.getAttribute("width")
    switch (this.code) {
      case this.VIEW_STANDARD:
        videosphere.setAttribute("visible",true)
        cam.setAttribute("height", curHeight()/this.ZOOM_SCALE_FACTOR)
        cam.setAttribute("width", curWidth()/this.ZOOM_SCALE_FACTOR)
        sky.setAttribute("visible", false)
        break;
      case this.VIEW_ZOOMED:
        sky.setAttribute("visible",true)
        cam.setAttribute("visible",true)
        videosphere.setAttribute("visible",false)
        arrows.forEach((node) => {node.setAttribute("visible",true)});
        cam.setAttribute("height", curHeight()*this.ZOOM_SCALE_FACTOR)
        cam.setAttribute("width", curWidth()*this.ZOOM_SCALE_FACTOR)
        break;
      case this.VIEW_360:
        cam.setAttribute("visible", false)
        sky.setAttribute("visible", false)
        arrows.forEach((node) => {node.setAttribute("visible",false)});
        break;
    }
    adjustArrowsToView();

   };

function adjustArrowsToView() {

  let el = document.getElementById('mainCam')
  let cam = el.querySelectorAll(":scope a-video")[0];
  let view_height = cam.getAttribute("height");
  let view_width = cam.getAttribute("width");
  let arrow_left = document.querySelector("#arrow_left");
  let arrow_right = document.querySelector("#arrow_right");
  let arrow_down = document.querySelector("#arrow_down");
  let arrow_up = document.querySelector("#arrow_up");

  function offsetArrow(arrow, x, y) {
    let default_pos = arrow.getAttribute("position");    
    let new_pos = {
      x: x,
      y: y,
      z: default_pos.z
    };
    arrow.setAttribute("position", new_pos);
  }

  const EDGE_OFFSET_SCALE = 1.5;

  function getHorizontalOffset(arrow) {
    let arrow_width = arrow.getAttribute("width");
    return view_width/2 - ((arrow_width/2) * EDGE_OFFSET_SCALE);
  }

  function getVerticalOffset(arrow) {
    let arrow_width = arrow.getAttribute("width");
    return view_height/2  - ((arrow_width/2) * EDGE_OFFSET_SCALE);
  }

  offsetArrow(arrow_left, -getHorizontalOffset(arrow_left), 0);
  offsetArrow(arrow_right, getHorizontalOffset(arrow_right), 0);
  offsetArrow(arrow_down, 0, -getVerticalOffset(arrow_down));
  offsetArrow(arrow_up, 0, getVerticalOffset(arrow_up), 0);
}
