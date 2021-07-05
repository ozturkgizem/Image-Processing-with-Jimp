const { default: png } = require("@jimp/png");

var express = require("express");
var Jimp = require('jimp');

var app = express();

var imageOriginal = "./images/1.jpg";
var focusArea = { x1: 1100, y1: 61, x2: 3134, y2: 1170 };
var result = { w: 3000, h:2000, q: 60 };

Jimp.read(imageOriginal, (err, image) => {
  if (err) throw err;
  
  var lenna = { w: image.bitmap.width, h: image.bitmap.height };

  var temp = image.clone();
  var resultCanvas = new Jimp( 3000, lenna.h );


  temp = image.clone();
  var imageRepB = temp.crop( focusArea.x2, 0, lenna.w - focusArea.x2 , lenna.h );
  var imageRepBF = imageRepB.clone();
  imageRepBF.flip( true, false );

  var miniCanvasB = new Jimp( imageRepB.bitmap.width * 2 , lenna.h );
  miniCanvasB.composite( imageRepB, imageRepB.bitmap.width, 0 );
  miniCanvasB.composite( imageRepBF, 0, 0 );
 
  //sağ kısım
  gapw = 3000;
  var i = 0;  
  var y = 0;
  while( gapw > miniCanvasB.bitmap.width){
    resultCanvas.composite( imageRepB, y, 0 );
    gapw = gapw - miniCanvasB.bitmap.width;
    i = i + 1;
    y = y + miniCanvasB.bitmap.width;
  };
  
  if(gapw != 0 ){
    var temp = miniCanvasB.clone();
    var lastRepB = temp.crop( 0, 0, gapw, lenna.h );
    resultCanvas.composite( lastRepB, i * miniCanvasB.bitmap.width, 0 );
  }

  resultCanvas.resize(result.w, Jimp.AUTO);

  resultCanvas.quality(result.q);
  resultCanvas.write("newpic11.jpg");
});