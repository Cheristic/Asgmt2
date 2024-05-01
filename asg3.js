// ColoredPoint.js (c) 2012 matsuda
// Taken by Ethan Heffan 2024

// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotationMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotationMatrix * u_ModelMatrix * a_Position;
    v_TexCoord = a_TexCoord;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_textureSelector;
  varying vec2 v_TexCoord;
  void main() {

    if (u_textureSelector == -2) {
      gl_FragColor = u_FragColor;
    } 
    else if (u_textureSelector == -1) {
      gl_FragColor = vec4(v_TexCoord, 1.0, 1.0);
    }
    else if (u_textureSelector == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_TexCoord);
    }
    else if (u_textureSelector == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_TexCoord);
    } 
    else {
      gl_FragColor = vec4(1, .2, .2, 1);
    }
    
  }`

let canvas;
let gl;
// vertex shader variables
let a_Position;
let a_TexCoord;
let u_ModelMatrix;
let u_GlobalRotationMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
// fragment shader variables
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_textureSelector;

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

  // Get the storage location of vertex shader variables
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }


  // Get the storage location of fragment shader variables
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_textureSelector = gl.getUniformLocation(gl.program, 'u_textureSelector');
  if (!u_textureSelector) {
    console.log('Failed to get the storage location of u_textureSelector');
    return;
  }
}

function initTextures() {

  // Create the image object
  var image0 = new Image();
  var image1 = new Image();
  if (!image0 || !image1) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image0.onload = function(){ sendImageToTexture2D(u_Sampler0, image0, 0); };
  image1.onload = function(){ sendImageToTexture2D(u_Sampler1, image1, 1); };
  // Tell the browser to load an Image
  image0.src = '/resources/pinkflower.jpg';
  image1.src = '/resources/redflower.jpg';

  return true;
}

function sendImageToTexture2D(sampler, image, texUnit) {
  // Create a texture object
  var texture = gl.createTexture(); 
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
  // Make the texture unit active
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else if (texUnit == 1) {
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);   

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
  gl.uniform1i(sampler, texUnit);   // Pass the texure unit to u_Sampler
}
// ## WEBGL SETUP END ##

// Page Globals
let g_fps;

// Scene Globals
let g_Scene;


//  ## HELPER FUNCTIONS START ##
function addActionsForHtmlUI() {

  g_fps = document.getElementById("fps");

  // Camera angle slider
  document.getElementById("angleSlide").oninput = function() {g_Scene.globalRotationY = this.value;}
}

//  ## HELPER FUNCTIONS END ##


// ## CORE SECTION START ##
function main() {

  setupWebGL();
  connectVariablesToGLSL();
  initTextures();

  addActionsForHtmlUI();

  g_Scene = new Scene();

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

  // calculate fps
  if (t > frameTrackTime + 1) {
    g_fps.innerHTML = (1 / (dt)).toFixed(1);
    frameTrackTime = t;
  }

  handleRender();

  requestAnimationFrame(update);
}

function handleRender() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
 
  g_Scene.renderScene();
}
// ## CORE SECTION END ##
