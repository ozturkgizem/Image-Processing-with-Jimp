const { default: png } = require("@jimp/png");

var express = require("express");
var Jimp = require('jimp');

var app = express();

var imageOriginal = "./images/1.jpg";
var focusArea = { x1: 1100, y1: 61, x2: 3134, y2: 1170 };
var result = { w: 6000, h:2000, q: 60 };

Jimp.read(imageOriginal, (err, image) => {
  if (err) throw err;
  var lenna = { w: image.bitmap.width, h: image.bitmap.height };
  
  if( result.w > image.bitmap.width && result.h > image.bitmap.height){
    var temp = verticalClone ( image, result, focusArea );
    var reCanvas = horizontalClone( temp, result, focusArea );

  }
  else if( result.w > image.bitmap.width || result.h > image.bitmap.height){
    if( result.h > image.bitmap.height ){
      var reCanvas = verticalClone ( image, result, focusArea );
    }
    else if(result.w > image.bitmap.width){
      reCanvas = horizontalClone( image, result, focusArea );
    }
  };

  reCanvas.resize(result.w, Jimp.AUTO);
  reCanvas.quality(result.q);
  reCanvas.write("newpic5.jpg");
});


///////////////////
  function verticalClone( image, result, focusArea ){
    var temp = image.clone();
    var lenna = { w: image.bitmap.width, h: image.bitmap.height };
    var resultCanvas = new Jimp(lenna.w, result.h );
  
    var gy = resultCanvas.bitmap.height/2 - image.bitmap.height/2;
    resultCanvas.composite( temp, 0, gy ); //*
  
    temp = image.clone();
    imageRepA = temp.crop( 0, 0, lenna.w, focusArea.y1 );
    temp = image.clone();
    imageRepB = temp.crop( 0, focusArea.y2, lenna.w, lenna.h - focusArea.y2 );
    
    var imageRepAF = imageRepA.clone();
    imageRepAF.flip( false, true );
    var imageRepBF = imageRepB.clone();
    imageRepBF.flip( false, true );
  
    var miniCanvasA = new Jimp( lenna.w, imageRepA.bitmap.height * 2 );
    miniCanvasA.composite( imageRepA, 0, 0 );
    miniCanvasA.composite( imageRepAF, 0, imageRepA.bitmap.height );

    var miniCanvasB = new Jimp( lenna.w, imageRepB.bitmap.height * 2 );
    miniCanvasB.composite( imageRepB, 0, imageRepB.bitmap.height );
    miniCanvasB.composite( imageRepBF, 0, 0 ); 
  
    //minicanvasA
    var gaph = result.h/2 - image.bitmap.height/2 ;
    while( gaph > miniCanvasA.bitmap.height ){
      resultCanvas.composite( miniCanvasA, 0, gaph - miniCanvasA.bitmap.height );
      gaph = gaph - miniCanvasA.bitmap.height;
    };
    
    if( gaph != 0 ){
      var temp = miniCanvasA.clone();
      var lastRepA = temp.crop( 0, miniCanvasA.bitmap.height - gaph, lenna.w, gaph);
      resultCanvas.composite( lastRepA, 0, 0 );
    }
    //minicanvasB
    gaph = result.h/2 - image.bitmap.height/2 ;
    var i = 0;
    var y = 0;
    while( gaph > miniCanvasB.bitmap.height ){
      resultCanvas.composite( miniCanvasB, 0, lenna.h + y + result.h/2 - image.bitmap.height/2);
      gaph = gaph - miniCanvasB.bitmap.height;
      y = y + miniCanvasB.bitmap.height;
      i = i + 1;
    };
    
    if( gaph != 0 ){
      var temp = miniCanvasB.clone();
      var lastRepB = temp.crop( 0, 0, lenna.w, gaph);
      resultCanvas.composite( lastRepB, 0, lenna.h + i *  miniCanvasB.bitmap.height + result.h/2 - image.bitmap.height/2 );
    }
    return resultCanvas;
  }


  function horizontalClone( image, result, focusArea ){
    var lenna = { w: image.bitmap.width, h: image.bitmap.height };
    var resultCanvas = new Jimp( result.w, lenna.h );
  
    var gx = result.w/2 - image.bitmap.width/2;
    resultCanvas.composite( image, gx, 0 ); //*
  
    temp = image.clone();
    imageRepA = temp.crop( 0, 0, focusArea.x1, lenna.h );
    var imageRepAF = imageRepA.clone();
    imageRepAF.flip( true, false );
   
    temp = image.clone();
    imageRepB = temp.crop( focusArea.x2, 0, lenna.w - focusArea.x2 , lenna.h );
    var imageRepBF = imageRepB.clone();
    imageRepBF.flip( true, false );

    var miniCanvasA = new Jimp( imageRepA.bitmap.width * 2 , lenna.h );
    miniCanvasA.composite( imageRepA, 0, 0 );
    miniCanvasA.composite( imageRepAF,imageRepA.bitmap.width, 0 );

    var miniCanvasB = new Jimp( imageRepB.bitmap.width * 2 , lenna.h );
    miniCanvasB.composite( imageRepB, imageRepB.bitmap.width, 0 );
    miniCanvasB.composite( imageRepBF, 0, 0 );
  
    //imagerepA- gapw relation
    var gapw = result.w/2 - image.bitmap.width/2 ;
    
    while( gapw > miniCanvasA.bitmap.width){
      resultCanvas.composite( miniCanvasA, gapw - miniCanvasA.bitmap.width, 0 );
      gapw = gapw - miniCanvasA.bitmap.width;
    };
    
    if(gapw != 0 ){
      var temp = miniCanvasA.clone();
      var lastRepA = temp.crop( miniCanvasA.bitmap.width - gapw , 0, gapw, lenna.h );
      resultCanvas.composite( lastRepA, 0, 0 );
    }
    
    //sağ kısım
    gapw = result.w/2 - image.bitmap.width/2 ;
    var i = 0;  
    var y = 0;
    while( gapw > miniCanvasB.bitmap.width){
    resultCanvas.composite( imageRepB, lenna.w + y + result.w/2 - image.bitmap.width/2 , 0 );
    gapw = gapw - miniCanvasB.bitmap.width;
    i = i + 1;
    y = y + miniCanvasB.bitmap.width;
  };
  
  if(gapw != 0 ){
    var temp = miniCanvasB.clone();
    var lastRepB = temp.crop( 0, 0, gapw, lenna.h );
    resultCanvas.composite( lastRepB, lenna.w + i * miniCanvasB.bitmap.width + result.w/2 - image.bitmap.width/2 , 0 );
  }

    return resultCanvas;
  };


  
  