console.log("I ran")

AFRAME.registerComponent('rotation-reader', {
  init: function () {
    let sceneEl = this.el;
    this.el.addEventListener('click', function (evt) {
      let el = document.querySelector("a-cylinder ")
      if(el.getAttribute("color") == "#FFC65D"){
        el.setAttribute("color","green")
      }
      else{
        el.setAttribute("color","#FFC65D")
      }
    });

    this.el.addEventListener('trackpadchanged', function (evt) {
      let el = document.querySelector("a-cylinder ")
      if(el.getAttribute("color") == "#FFC65D"){
        el.setAttribute("color","white")
      }
      else{
        el.setAttribute("color","#FFC65D")
      }
    });

    this.el.addEventListener('triggerchanged', function (evt) {
      let el = document.querySelector("a-cylinder ")
      if(el.getAttribute("color") == "#FFC65D"){
        el.setAttribute("color","red")
      }
      else{
        el.setAttribute("color","#FFC65D")
      }
    });
  
  },

  trackpadchanged: function () {
      var rotation = this.el.getAttribute('rotation');
      console.log(rotation)

      if(el.getAttribute("color") == "#FFC65D"){
        el.setAttribute("color","white")
      }
      else{
        el.setAttribute("color","#FFC65D")
      }
  },

  triggerchanged: function () {
    var rotation = this.el.getAttribute('rotation');
    console.log(rotation)

    if(el.getAttribute("color") == "#FFC65D"){
      el.setAttribute("color","red")
    }
    else{
      el.setAttribute("color","#FFC65D")
    }
},

  // tick: function () {
  //   var rotation = this.el.getAttribute('rotation');
  //   console.log(rotation)
  //   },
});


const toggleView = (evt) => {
   
  return x * y 
 };
