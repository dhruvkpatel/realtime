AFRAME.registerComponent('rotation-reader', {
    init: function () {
      let sceneEl = this.el;
      this.el.addEventListener('click', (evt) => toggleView(evt))
      //this.el.addEventListener('triggerchanged', (evt) => toggleView(evt))
    },
  
    // tick: function () {
    //   var rotation = this.el.getAttribute('rotation');
    //   console.log(rotation)
    //   },
  });
  
  
  const toggleView = (evt) => {
    if(typeof this.code == 'undefined'){
      this.VIEW_STANDARD= "Standard View"
      this.VIEW_ZOOMED = "Zoomed View"
      this.VIEW_360 = "360 View"
      this.options = [this.VIEW_STANDARD, this.VIEW_ZOOMED, this.VIEW_360]
      this.code = this.options[this.options.length-1]
      this.ZOOM_SCALE_FACTOR = 3
    }
    if(this.code  === options[options.length-1]){
      this.code = options[0]
    }
    else{
      this.code = options[options.indexOf(this.code)+1]
    }
  
    let el = document.getElementById('mainCam')
    let cam = el.querySelectorAll(":scope > a-video")[0];
    const curHeight = ()=>cam.getAttribute("height")
    const curWidth = ()=>cam.getAttribute("width")
    console.log(this.code)
    switch (this.code) {
      case this.VIEW_STANDARD:
        cam.setAttribute("visible",true)
        cam.setAttribute("height", curHeight()*this.ZOOM_SCALE_FACTOR)
        cam.setAttribute("width", curWidth()*this.ZOOM_SCALE_FACTOR)
        break;
      case this.VIEW_ZOOMED:
        cam.setAttribute("height", curHeight()/this.ZOOM_SCALE_FACTOR)
        cam.setAttribute("width", curWidth()/this.ZOOM_SCALE_FACTOR)
        break;
      case this.VIEW_360:
        cam.setAttribute("visible", false)
        break;
    }
  
  
    //cam.setAttribute('height', 15)
    //if(this.code == )
   };
  