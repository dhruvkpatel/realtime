console.log("I ran")

AFRAME.registerComponent('rotation-reader', {
  init: function () {
    let sceneEl = this.el;
    this.el.addEventListener('click', (evt) => toggleView(evt))
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
  }
  if(this.code  === options[options.length-1]){
    this.code = options[0]
  }
  else{
    this.code = options[options.indexOf(this.code)+1]
  }

  let el = document.getElementById('mainCam')
  let cam = el.querySelectorAll(":scope > a-video")[0];
  
  if(this.code == this.VIEW_STANDARD){
    
  }
  //cam.setAttribute('height', 15)

  //if(this.code == )
  console.log(this.code)
 };
