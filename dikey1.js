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
  imageRepA = temp.crop( 0, 0, focusArea.x1, lenna.h );
  var imageRepAF = imageRepA.clone();
  imageRepAF.flip( true, false );

  var miniCanvasA = new Jimp( imageRepA.bitmap.width * 2 , lenna.h );
  miniCanvasA.composite( imageRepA, 0, 0 );
  miniCanvasA.composite( imageRepAF,imageRepA.bitmap.width, 0 );


  //imagerepA- gapw relation
  var gapw = 3000;
  
  while( gapw > miniCanvasA.bitmap.width){
    resultCanvas.composite( miniCanvasA, gapw - miniCanvasA.bitmap.width, 0 );
    gapw = gapw - miniCanvasA.bitmap.width;
  };
  
  if(gapw != 0 ){
    var temp = miniCanvasA.clone();
    var lastRepA = temp.crop( miniCanvasA.bitmap.width - gapw , 0, gapw, lenna.h );
    resultCanvas.composite( lastRepA, 0, 0 );
  }
 

  resultCanvas.resize(result.w, Jimp.AUTO);

  resultCanvas.quality(result.q);
  resultCanvas.write("newpic10.jpg");
});