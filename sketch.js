// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */
var canvas;
var context;
let video;
let poseNet;
let poses = [];
function drawIt(v,c,w,h) {
  if(v.paused || v.ended) return false;
  c.drawImage(v,0,0,w,h);
  setTimeout(draw,20,v,c,w,h);
}

function setup() {

  video = document.getElementById('fight');
  
  canvas = document.getElementById('fightShow');
  context = canvas.getContext('2d');

  var cw = Math.floor(canvas.clientWidth);
  var ch = Math.floor(canvas.clientHeight);
  canvas.width = cw;
  canvas.height = ch;
/*
  video.addEventListener('play', function(){
      drawIt(this,context,cw,ch);
  },false);
*/
  createCanvas(640, 480);

  
  //video = createCapture(VIDEO);
  //video.size(width, height);
  // Create a new poseNet method
  const poseNet = ml5.poseNet(video,{
    architecture: 'ResNet50',
    imageScaleFactor: 0.2,
    outputStride: 16,
    flipHorizontal: false,
    minConfidence: 0.1,
    maxPoseDetections: 3,
    scoreThreshold: 0.2,
    nmsRadius: 20,
    detectionType: 'multiple',
    multiplier: .5,
    quantBytes: 1
   } ,modelLoaded);

  // Listen to new 'pose' events
  poseNet.on('pose', (results) => {
    //poses.length = 0;
    poses = results;

  });

}

function draw() {
  //image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  if(document.getElementById('defaultCanvas0') != null){
    var tempcanvas = document.getElementById('defaultCanvas0');
    canvas.width  = 640;
    canvas.height = 360;
    canvas.style.width  = '640px';
    canvas.style.height = '360px';
    tempcontext = tempcanvas.getContext('2d');
  }
  
  tempcontext.clearRect(0,0,640,360);
  

  
  drawKeypoints();
  drawSkeleton();
}

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}


// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
