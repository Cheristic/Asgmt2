// ColoredPoint.js (c) 2012 matsuda
// Taken by Ethan Heffan 2024

// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotationMatrix;
  void main() {
    gl_Position = u_GlobalRotationMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_ModelMatrix;
let u_GlobalRotationMatrix;
let u_FragColor;

// ## WEBGL SETUP START ##
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotationMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotationMatrix');
  if (!u_GlobalRotationMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotationMatrix');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}


function setupGlobalVariables() {
  g_globalRotationMatrix = new Matrix4().setIdentity().rotate(g_globalAngleY, 0, 1, 0);
}
// ## WEBGL SETUP END ##

// UI Globals
let g_1stlimbAngle = 0;
let g_2ndlimbAngle = 0;
let g_3rdlimbAngle = 0;
let g_BooSpeed = 0.008;
let g_globalAngleY = 90;
let g_globalAngleZ = 90;
let g_globalRotationMatrix;
let g_animationBool = true;
let g_fps;
let g_mousePosition;
let g_isPoked = false;

// Rendering Globals
let g_shapesList = [];
let g_animatedShapesList = [];

//  ## HELPER FUNCTIONS START ##
function addActionsForHtmlUI() {

  g_fps = document.getElementById("fps");

  document.getElementById("animationBool").addEventListener("click", () => {g_animationBool = !g_animationBool; });

  document.getElementById("1stlimb").oninput = function() {g_1stlimbAngle = this.value; renderScene();};
  document.getElementById("2ndlimb").oninput = function() {g_2ndlimbAngle = this.value; renderScene();};
  document.getElementById("3rdlimb").oninput = function() {g_3rdlimbAngle = this.value; renderScene();};
  document.getElementById("booSpeed").oninput = function() {g_BooSpeed = this.value/1000;};

  // Camera angle slider
  document.getElementById("angleSlide").oninput = function() {console.log("input"); g_globalAngleY = this.value; renderScene();}

  document.addEventListener("click", (e) => {if (e.shiftKey) { // poke event
    g_isPoked = !g_isPoked;
  }})

  canvas.addEventListener('mousemove', updateMousePosition, false);
}

function updateMousePosition (e) {
  g_globalAngleY = -1*(e.pageX+1);
  console.log(e.pageY);
  g_globalAngleZ = (e.pageY)*-.05 + 10;
}

function convertClientCoordinatesToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x,y];
}

function createScenePlatform() {
  let c = new Cube([0, -2, 0], [0.8, 0.45, 0.25, 1.0], 260, 260, 400);
  c.setLocalMatrix([0, 0, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  g_shapesList.push(c);
}

function createCreature() {


  let body = new Cylinder([0, 0, 0], [.65, 1, 0.85, 1.0], 25, 10, 100, 15);
  body.setLocalMatrix([-.25, .25, 0], [-5, 0, 0, 1], [1.0, 1.0, 1.0]);
  body.animation = function () {
    body.dynamicMatrix.setIdentity();
    if (g_isPoked) {   
      body.dynamicMatrix.rotate(180, 0, 1, 0);
    }
  }
  g_shapesList.push(body);
  g_animatedShapesList.push(body);

  let lowerBody = new Cylinder([0, 0, 0], [.65, 1, 0.85, 1.0], 27, 25, 25, 15);
  lowerBody.setLocalMatrix([0, .125, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  body.children.push(lowerBody);
  g_shapesList.push(lowerBody);
  let lowerBody2 = new Cylinder([0, 0, 0], [.65, 1, 0.85, 1.0], 25, 20, 25, 15);
  lowerBody2.setLocalMatrix([0, .062, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  body.children.push(lowerBody2);
  g_shapesList.push(lowerBody2);
  let lowerBody3 = new Cylinder([0, 0, 0], [.65, 1, 0.85, 1.0], 20, 15, 10, 15);
  lowerBody3.setLocalMatrix([0, .036, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  body.children.push(lowerBody3);
  g_shapesList.push(lowerBody3);
  let pelvis = new Cylinder([0, 0, 0], [.65, 1, 0.85, 1.0], 13, 8, 35, 10);
  pelvis.setLocalMatrix([0, 0, .085], [90, 0, 0, 1], [1.0, 1.0, 1.0]);
  pelvis.localMatrix.translate(.27, .24, -.085);
  pelvis.localMatrix.rotate(75, 1, 0, 0);
  pelvis.localMatrix.translate(.03, -.09, -.01)
  pelvis.animation = function () {
    pelvis.dynamicMatrix.setIdentity();
    if (g_isPoked) {   
      pelvis.dynamicMatrix.rotate(180, 1, 0, 0);
      pelvis.dynamicMatrix.translate(0, -.195, 0);
    }
  }
  g_shapesList.push(pelvis);
  g_animatedShapesList.push(pelvis);


  let rLegQuad = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 15, 9, 40, 15);
  rLegQuad.setLocalMatrix([0, 0, 0], [-270, 0, 0, 1], [1.0, 1.0, 1.0]);
  rLegQuad.localMatrix.rotate(-20, 0, 1, 0)
  rLegQuad.localMatrix.rotate(-25, 1, 0, 0)
  pelvis.children.push(rLegQuad);
  g_shapesList.push(rLegQuad);

  let lLegQuad = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 15, 9, 40, 15);
  lLegQuad.setLocalMatrix([0, .18, .04], [-270, 0, 0, 1], [1.0, 1.0, 1.0]);
  lLegQuad.localMatrix.rotate(170, 0, 1, 0)
  lLegQuad.localMatrix.rotate(25, 1, 0, 0)
  //lLegQuad.localMatrix.translate(.3, -.25, 0)
  pelvis.children.push(lLegQuad);
  g_shapesList.push(lLegQuad);

  
  let rLegCalf = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 15, 9, 30, 15);
  rLegCalf.setLocalMatrix([0, .15, -.0285], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  rLegCalf.localMatrix.rotate(60, 1, 0, 0)
  rLegQuad.children.push(rLegCalf);
  g_shapesList.push(rLegCalf);
  let lLegCalf = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 15, 9, 30, 15);
  lLegCalf.setLocalMatrix([0, .15, .0285], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  lLegCalf.localMatrix.rotate(-60, 1, 0, 0)
  lLegQuad.children.push(lLegCalf);
  g_shapesList.push(lLegCalf);

  let rFootBase = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 13, 9, 50, 10);
  rFootBase.setLocalMatrix([0, 0, 0], [90, 0, 0, 1], [1.0, 1.0, 1.0]);
  rFootBase.localMatrix.translate(-.1, .02, -.09)
  rFootBase.localMatrix.rotate(270, 1, 0, 0)
  rFootBase.localMatrix.rotate(40, 0, 0, 1)
  rFootBase.localMatrix.rotate(180, 0, 1, 0);
  rFootBase.localMatrix.scale(0.5, 1.0, 1.0);
  rFootBase.localMatrix.translate(-.3, -.38, .02);
  rLegCalf.children.push(rFootBase);
  g_shapesList.push(rFootBase);

  let lFootBase = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 13, 9, 50, 10);
  lFootBase.setLocalMatrix([0, 0, 0], [90, 0, 0, 1], [1.0, 1.0, 1.0]);
  lFootBase.localMatrix.translate(-.1, .02, .09)
  lFootBase.localMatrix.rotate(-270, 1, 0, 0)
  lFootBase.localMatrix.rotate(40, 0, 0, 1)
  lFootBase.localMatrix.rotate(180, 0, 1, 0);
  lFootBase.localMatrix.scale(0.5, 1.0, 1.0);
  lFootBase.localMatrix.translate(-.3, -.38, -.02);
  lLegCalf.children.push(lFootBase);
  g_shapesList.push(lFootBase);
  
  let rToe1 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 15, 10);
  rToe1.setLocalMatrix([-.02, -.04, -.03], [-45, 0, 0, 1], [1.0, 1.0, 1.0]);
  rToe1.localMatrix.rotate(5, 1, 0, 0);
  rFootBase.children.push(rToe1);
  g_shapesList.push(rToe1);
  let rToe2 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 15, 10);
  rToe2.setLocalMatrix([-.02, -.04, .03], [-45, 0, 0, 1], [1.0, 1.0, 1.0]);
  rToe2.localMatrix.rotate(-5, 1, 0, 0);
  rFootBase.children.push(rToe2);
  g_shapesList.push(rToe2);

  let lToe1 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 15, 10);
  lToe1.setLocalMatrix([-.02, -.04, -.03], [-45, 0, 0, 1], [1.0, 1.0, 1.0]);
  lToe1.localMatrix.rotate(5, 1, 0, 0);
  lFootBase.children.push(lToe1);
  g_shapesList.push(lToe1);
  let lToe2 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 15, 10);
  lToe2.setLocalMatrix([-.02, -.04, .03], [-45, 0, 0, 1], [1.0, 1.0, 1.0]);
  lToe2.localMatrix.rotate(-5, 1, 0, 0);
  lFootBase.children.push(lToe2);
  g_shapesList.push(lToe2);

  let headBase = new Cylinder([0, 0, 0], [.87, 0.13, 0.36, 1.0], 30, 25, 20, 10);
  headBase.setLocalMatrix([0, .4, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  body.children.push(headBase);
  g_shapesList.push(headBase);
  let head1 = new Cylinder([0, 0, 0], [.95, 0.59, 0.59, 1.0], 55, 35, 25, 15);
  head1.setLocalMatrix([0, .03, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  headBase.children.push(head1);
  g_shapesList.push(head1);
  let head2 = new Cylinder([0, 0, 0], [.87, 0.13, 0.22, 1.0], 55, 50, 20, 15);
  head2.setLocalMatrix([0, .045, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  headBase.children.push(head2);
  g_shapesList.push(head2);
  let head3 = new Cylinder([0, 0, 0], [.95, 0.59, 0.59, 1.0], 50, 40, 10, 15);
  head3.setLocalMatrix([0, .12, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  headBase.children.push(head3);
  g_shapesList.push(head3);
  let head4 = new Cylinder([0, 0, 0], [.87, 0.13, 0.22, 1.0], 40, 25, 10, 15);
  head4.setLocalMatrix([0, .145, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  headBase.children.push(head4);
  g_shapesList.push(head4);

  let lEye = new Cylinder([0, 0, 0], [0.1, 0.1, 0.1, 1.0], 3.5, 3.5, 10, 15);
  lEye.setLocalMatrix([.08, -.01, -.05], [105, 0, 0, 1], [1.0, 1.0, 1.0]);
  lEye.localMatrix.rotate(25, 1, 0, 0);
  headBase.children.push(lEye);
  g_shapesList.push(lEye);
  let rEye = new Cylinder([0, 0, 0], [0.1, 0.1, 0.1, 1.0], 3.5, 3.5, 10, 15);
  rEye.setLocalMatrix([.08, -.01, .05], [105, 0, 0, 1], [1.0, 1.0, 1.0]);
  rEye.localMatrix.rotate(-25, 1, 0, 0);
  headBase.children.push(rEye);
  g_shapesList.push(rEye);

  let rShoulder = new Cylinder([0, 0, 0], [.7, .9, 0.85, 1.0], 8, 7, 10, 15);
  rShoulder.setLocalMatrix([.015, .32, -.095], [180, 0, 0, 1], [1.0, 1.0, 1.0]);
  rShoulder.localMatrix.rotate(-45, 0, 1, 0);
  rShoulder.localMatrix.rotate(-45, 1, 0, 0);
  body.children.push(rShoulder);
  g_shapesList.push(rShoulder);
  let lShoulder = new Cylinder([0, 0, 0], [.7, .9, 0.85, 1.0], 8, 7, 10, 15);
  lShoulder.setLocalMatrix([.015, .32, .095], [180, 0, 0, 1], [1.0, 1.0, 1.0]);
  lShoulder.localMatrix.rotate(45, 0, 1, 0);
  lShoulder.localMatrix.rotate(45, 1, 0, 0);
  body.children.push(lShoulder);
  g_shapesList.push(lShoulder);

  let rArm1 = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 6, 5, 25, 15);
  rArm1.setLocalMatrix([0, .3, -.13], [180, 0, 0, 1], [1.0, 1.0, 1.0]);
  rArm1.localMatrix.rotate(-45, 0, 1, 0);
  rArm1.localMatrix.rotate(-15, 1, 0, 0);
  body.children.push(rArm1);
  g_shapesList.push(rArm1);
  
  // rArm1 Animation
  rArm1.animation = function(time) {
    rArm1.dynamicMatrix.setIdentity();
    if (g_isPoked) {
      let amount = (Math.sin(time * g_BooSpeed) * 8 + Math.sin(time * g_BooSpeed * 0.3) * 8);
      rArm1.dynamicMatrix.rotate(180+amount, 1, 0, 1);
      rArm1.dynamicMatrix.rotate(70, 0, 0, 1);
      rArm1.dynamicMatrix.rotate(80, 0, 1, 0);
    } 
    else {
      let amount = (((Math.sin(time * g_BooSpeed)*0.5)+0.6) * 95);
      rArm1.dynamicMatrix.rotate(amount, 1, 0, 1);
      rArm1.dynamicMatrix.rotate(amount/4, 0, 0, 1);
      if (amount >= 104.3) console.log("boo");
    }
    
  }
  g_animatedShapesList.push(rArm1);

  let rArm2 = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 5, 5, 20, 15);
  rArm2.setLocalMatrix([0, .1, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  rArm1.children.push(rArm2);
  g_shapesList.push(rArm2);
  rArm2.animation = function(time) {
    rArm2.dynamicMatrix.setIdentity();
    if (g_isPoked) {
      let amount = ((Math.sin(time * g_BooSpeed)*0.5)+.5) * 2 + 1;
      //let s_amount = ((Math.sin(time * 0.005)*0.5)+.5) * .5 + 1;
      rArm2.dynamicMatrix.scale(1, amount, 1);
    } else {
      let amount = ((Math.sin(time * g_BooSpeed)*0.5)+.5) * 8 + 1;
      //let s_amount = ((Math.sin(time * 0.005)*0.5)+.5) * .5 + 1;
      rArm2.dynamicMatrix.scale(1, amount, 1);
    }
    
  }
  g_animatedShapesList.push(rArm2);
  let rHand = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 11, 7, 6, 15);
  rHand.setLocalMatrix([-.015, .11, 0], [180, 0, 0, 1], [1.0, .9, .9]);
  rArm2.children.push(rHand);
  g_shapesList.push(rHand);
  rHand.animation = function(time) {
    rHand.dynamicMatrix.setIdentity();
    if (g_isPoked) {

    } else {
      let amount = ((Math.sin(time * g_BooSpeed)*0.5)+.5) * 8 + 1;
      rHand.dynamicMatrix.scale(amount, 1, amount);
    }
    
  }
  g_animatedShapesList.push(rHand);

  let rFinger1 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 25, 10);
  rFinger1.setLocalMatrix([.02, .02, -.025], [20, 0, 1, 0], [0.5, 0.5, 0.5]);
  rFinger1.localMatrix.rotate(-110, 0, 0, 1);
  rHand.children.push(rFinger1);
  g_shapesList.push(rFinger1);
  let rFinger2 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 25, 10);
  rFinger2.setLocalMatrix([.02, .02, 0], [0, 0, 1, 0], [0.5, 0.5, 0.5]);
  rFinger2.localMatrix.rotate(-110, 0, 0, 1);
  rHand.children.push(rFinger2);
  g_shapesList.push(rFinger2);
  let rFinger3 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 25, 10);
  rFinger3.setLocalMatrix([.02, .02, .025], [-20, 0, 1, 0], [0.5, 0.5, 0.5]);
  rFinger3.localMatrix.rotate(-110, 0, 0, 1);
  rHand.children.push(rFinger3);
  g_shapesList.push(rFinger3);

  let lArm1 = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 6, 5, 25, 15);
  lArm1.setLocalMatrix([0, .3, .13], [180, 0, 0, 1], [1.0, 1.0, 1.0]);
  lArm1.localMatrix.rotate(45, 0, 1, 0);
  lArm1.localMatrix.rotate(15, 1, 0, 0);
  body.children.push(lArm1);
  g_shapesList.push(lArm1);
  lArm1.animation = function(time) {
    lArm1.dynamicMatrix.setIdentity();
    if (g_isPoked) {
      let amount = (Math.sin(time * g_BooSpeed) * 8 + Math.sin(time * g_BooSpeed * 0.3) * 8);
      lArm1.dynamicMatrix.rotate(180+amount, 1, 0, 1);
      lArm1.dynamicMatrix.rotate(-80, 0, 0, 1);
      lArm1.dynamicMatrix.rotate(80, 0, 1, 0);
      //lArm1.dynamicMatrix.rotate(amount, -5, 1/5, 8);
    } else {
      let amount = (((Math.sin(time * g_BooSpeed)*0.5)+0.6) * 95);
      lArm1.dynamicMatrix.rotate(amount, -5, 1/5, 8);
    }
  }
  g_animatedShapesList.push(lArm1);

  let lArm2 = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 5, 5, 20, 15);
  lArm2.setLocalMatrix([0, .1, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
  lArm1.children.push(lArm2);
  g_shapesList.push(lArm2);
  lArm2.animation = function(time) {
    lArm2.dynamicMatrix.setIdentity();
    if (g_isPoked) {
      let amount = ((Math.sin(time * g_BooSpeed)*0.5)+.5) * 2 + 1;
      //let s_amount = ((Math.sin(time * 0.005)*0.5)+.5) * .5 + 1;
      lArm2.dynamicMatrix.scale(1, amount, 1);
    } else {
      let amount = ((Math.sin(time * g_BooSpeed)*0.5)+.5) * 8 + 1;
      //let s_amount = ((Math.sin(time * 0.005)*0.5)+.5) * .5 + 1;
      lArm2.dynamicMatrix.scale(1, amount, 1);
    }   
  }
  g_animatedShapesList.push(lArm2);
  let lHand = new Cylinder([0, 0, 0], [.8, 1, 0.95, 1.0], 11, 7, 6, 15);
  lHand.setLocalMatrix([-.015, .11, 0], [180, 0, 0, 1], [1.0, .9, .9]);
  lArm2.children.push(lHand);
  g_shapesList.push(lHand);
  lHand.animation = function(time) {
    lHand.dynamicMatrix.setIdentity();
    if (g_isPoked) {

    } else {
      let amount = ((Math.sin(time * g_BooSpeed)*0.5)+.5) * 8 + 1;
      lHand.dynamicMatrix.scale(amount, 1, amount);
    }  
  }
  g_animatedShapesList.push(lHand);
  let lFinger1 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 25, 10);
  lFinger1.setLocalMatrix([.02, .02, -.025], [20, 0, 1, 0], [0.5, 0.5, 0.5]);
  lFinger1.localMatrix.rotate(-110, 0, 0, 1);
  lHand.children.push(lFinger1);
  g_shapesList.push(lFinger1);
  let lFinger2 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 25, 10);
  lFinger2.setLocalMatrix([.02, .02, 0], [0, 0, 1, 0], [0.5, 0.5, 0.5]);
  lFinger2.localMatrix.rotate(-110, 0, 0, 1);
  lHand.children.push(lFinger2);
  g_shapesList.push(lFinger2);
  let lFinger3 = new Cylinder([0, 0, 0], [.8, .8, 0.95, 1.0], 5, 3, 25, 10);
  lFinger3.setLocalMatrix([.02, .02, .025], [-20, 0, 1, 0], [0.5, 0.5, 0.5]);
  lFinger3.localMatrix.rotate(-110, 0, 0, 1);
  lHand.children.push(lFinger3);
  g_shapesList.push(lFinger3);


}
//  ## HELPER FUNCTIONS END ##


// ## CORE SECTION START ##
function main() {

  setupWebGL();
  connectVariablesToGLSL();
  setupGlobalVariables();

  addActionsForHtmlUI();

  createScenePlatform();
  createCreature();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(update);
}

let dt = 0;
let lastTimeStamp = 0;
let frameTrackTime = 0;
function update(timestamp) {
  // used reference https://github.com/llopisdon/webgl-pong/blob/master/main.js
  const t = timestamp / 1000;
  dt = t - lastTimeStamp;
  lastTimeStamp = t;

  if (t > frameTrackTime + 1) {
    g_fps.innerHTML = (1 / (dt)).toFixed(1);
    frameTrackTime = t;
  }
  

  // update animations
  if (g_animationBool) {
    for (var i = 0; i < g_animatedShapesList.length; i++) {
      g_animatedShapesList[i].animation(timestamp);
    }
  }

  g_shapesList[6].dynamicMatrix.setIdentity();
  g_shapesList[7].dynamicMatrix.setIdentity();
  g_shapesList[6].dynamicMatrix.rotate(-g_1stlimbAngle, 1, 0, 0);
  g_shapesList[7].dynamicMatrix.rotate(-g_1stlimbAngle, 1, 0, 0);
  g_shapesList[10].dynamicMatrix.setIdentity();
  g_shapesList[10].dynamicMatrix.rotate(-g_2ndlimbAngle,0 , 0, 1);
  g_shapesList[11].dynamicMatrix.setIdentity();
  g_shapesList[11].dynamicMatrix.rotate(-g_2ndlimbAngle,0 , 0, 1);
  g_shapesList[9].dynamicMatrix.setIdentity();
  g_shapesList[9].dynamicMatrix.rotate(-g_3rdlimbAngle,1 , 0, 0);
  g_shapesList[8].dynamicMatrix.setIdentity();
  g_shapesList[8].dynamicMatrix.rotate(g_3rdlimbAngle,1 , 0, 0);



  renderScene();

  requestAnimationFrame(update);
}

function renderScene() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  g_globalRotationMatrix.setIdentity();
  g_globalRotationMatrix.translate(0, -.45, 0);
  g_globalRotationMatrix.rotate(-5, 1, 0, 0);
  g_globalRotationMatrix.rotate(g_globalAngleY, 0, 1, 0);
  g_globalRotationMatrix.rotate(g_globalAngleZ, 0, 0, 1);
  //g_globalRotationMatrix.scale(2.0, 2.0, 2.0);
  
  gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, g_globalRotationMatrix.elements);
 

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {

    g_shapesList[i].render();
  }
}
// ## CORE SECTION END ##
