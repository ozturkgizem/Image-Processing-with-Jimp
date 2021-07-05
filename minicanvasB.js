const { default: png } = require("@jimp/png");

var express = require("express");
var Jimp = require('jimp');

var app = express();

var imageOriginal = "./images/yelken.jpg";
var focusArea = { x1: 800, y1: 400, x2: 1800, y2: 800 };
var result = { w: 3000, h:2000, q: 60 };

Jimp.read(imageOriginal, (err, image) => {
  if (err) throw err;
  var temp = image.clone();
  
  var lenna = { w: image.bitmap.width, h: image.bitmap.height };

  var temp = image.clone();
    var lenna = { w: image.bitmap.width, h: image.bitmap.height };
    var resultCanvas = new Jimp(lenna.w, 1000 );

    temp = image.clone();
    imageRepB = temp.crop( 0, focusArea.y2, lenna.w, lenna.h - focusArea.y2 );
    

    var imageRepBF = imageRepB.clone();
    imageRepBF.flip( false, true );
  
    
    var miniCanvasB = new Jimp( lenna.w, imageRepB.bitmap.height * 2 );
    miniCanvasB.composite( imageRepB, 0, imageRepB.bitmap.height  );
    miniCanvasB.composite( imageRepBF, 0, 0); 
 
    var gaph = 1000;
    var y = 0;
    var i = 0;
    while( gaph > miniCanvasB.bitmap.height ){
      resultCanvas.composite( miniCanvasB, 0, y);
      gaph = gaph - miniCanvasB.bitmap.height;
      y = y + miniCanvasB.bitmap.height;
      i = i + 1;
    };
    
    if( gaph != 0 ){
    var temp = miniCanvasB.clone();
    var lastRepB = temp.crop( 0, 0, lenna.w, gaph);
    resultCanvas.composite( lastRepB, 0, i * miniCanvasB.bitmap.height );
    }
    

  resultCanvas.resize(result.w, Jimp.AUTO);

  resultCanvas.quality(result.q);
  resultCanvas.write("newpic9.jpg");
});