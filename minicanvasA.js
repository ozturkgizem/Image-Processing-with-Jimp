const { default: png } = require("@jimp/png");

var express = require("express");
var Jimp = require('jimp');

var app = express();

var imageOriginal = "./images/1.jpg";
var focusArea = { x1: 1100, y1: 61, x2: 3134, y2: 1170 };
var result = { w: 3000, h:2000, q: 60 };

Jimp.read(imageOriginal, (err, image) => {
  if (err) throw err;
  var temp = image.clone();
  
  var lenna = { w: image.bitmap.width, h: image.bitmap.height };

  var temp = image.clone();
    var lenna = { w: image.bitmap.width, h: image.bitmap.height };
    var resultCanvas = new Jimp(lenna.w, 1000 );

    temp = image.clone();
    imageRepA = temp.crop( 0, 0, lenna.w, focusArea.y1 );
    
    var imageRepAF = imageRepA.clone();
    imageRepAF.flip( false, true );

    var miniCanvasA = new Jimp( lenna.w, imageRepA.bitmap.height * 2 );
    miniCanvasA.composite( imageRepA, 0, 0 );
    miniCanvasA.composite( imageRepAF, 0, imageRepA.bitmap.height );

    var gaph = 1000;

    while( gaph > miniCanvasA.bitmap.height ){
      resultCanvas.composite( miniCanvasA, 0, gaph - miniCanvasA.bitmap.height );
      gaph = gaph - miniCanvasA.bitmap.height;
    };
    
    if( gaph != 0 ){
    var temp = miniCanvasA.clone();
    var lastRepA = temp.crop( 0, miniCanvasA.bitmap.height - gaph, lenna.w, gaph);
    resultCanvas.composite( lastRepA, 0, 0 );
    }
  

  resultCanvas.resize(result.w, Jimp.AUTO);

  resultCanvas.quality(result.q);
  resultCanvas.write("newpic8.jpg");
});