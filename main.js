const { default: png } = require("@jimp/png");
const clones = require("./clones.js");

var express = require("express");
var Jimp = require('jimp');

var app = express();

var imageOriginal = "./images/4.jpg";
var focusArea = { x1: 1331, y1: 192, x2: 3629, y2: 1440 };
var result = { w: 1000, ratio: { x: 16, y:9  }, q: 60 };

Jimp.read(imageOriginal, (err, image) => {
  if (err) throw err;
  var lenna = { w: image.bitmap.width, h: image.bitmap.height };
  focusArea.w = focusArea.x2 - focusArea.x1;
  focusArea.h = focusArea.y2 - focusArea.y1;
  focusArea.ratio = focusArea.w / focusArea.h;

  result.calcRatio = result.ratio.x / result.ratio.y;
  result.h = result.w / result.calcRatio; /**/


  //ratio inequality ve focus areaa result
  var tempFocus = Object.assign( {}, focusArea );
    //RATIO INEQUALITY
    //resultun wsi daha büyük
    if (result.calcRatio > focusArea.ratio) {
      //xdif=width
      var xdif = tempFocus.h / result.calcRatio;
      tempFocus.x2 = tempFocus.x1 + xdif;
      tempFocus.w = xdif;
      if (tempFocus.x2 > lenna.w) {
        var fark = tempFocus.x2 - lenna.w;
        tempFocus.x1 -= fark;
        tempFocus.x2 -= fark;
      }
    } else if (result.calcRatio < focusArea.ratio) {
      var ydif = tempFocus.w / result.calcRatio;
      tempFocus.y2 = tempFocus.y1 + ydif;
      tempFocus.h = ydif;
      if (tempFocus.y2 > lenna.h) { 
        var fark = tempFocus.y2 - lenna.h;
        tempFocus.y1 -= fark;
        tempFocus.y2 -= fark;
      }
    }; 
    if( tempFocus.x1 < 0 ){ tempFocus.x1 = 0; };
    if( tempFocus.y1 < 0 ){ tempFocus.y1 = 0; };

    tempFocus.ratio = result.calcRatio;

   //FOCUS AREA- RESULT RELATION
    if (lenna.w > tempFocus.w > result.w || lenna.h > tempFocus.h > result.h) {
      image.crop(tempFocus.x1, tempFocus.y1, tempFocus.w, tempFocus.h);
      tempFocus.x1 = 0;
      tempFocus.y1 = 0;
      tempFocus.x2 = tempFocus.w;
      tempFocus.y2 = tempFocus.h;
    }
    if (tempFocus.w < result.w < lenna.w  || tempFocus.h < result.h < lenna.h) {
      if (tempFocus.w < result.w) {
        var fark = result.w - tempFocus.w;
        tempFocus.x1 -= fark / 2;
        tempFocus.x2 += fark / 2;
        if (tempFocus.x2 > lenna.w) {
          var fark = tempFocus.x2 - lenna.w;
          tempFocus.x1 -= fark;
          tempFocus.x2 -= fark;
        }
        if(tempFocus.x1 < 0 ){
          var fark = - tempFocus.x1;
          tempFocus.x1 += fark;
          tempFocus.x2 += fark;
        }
      }if (tempFocus.h < result.h) { 
        var fark = result.h - tempFocus.h;
        tempFocus.y1 -= fark / 2;
        tempFocus.y2 += fark / 2;
        if (tempFocus.y2 > lenna.h) { 
          var fark = tempFocus.y2 - lenna.h;
          tempFocus.y1 -= fark;
          tempFocus.y2 -= fark;
        }
        if(tempFocus.y1 < 0 ){
          var fark = - tempFocus.y1;
          tempFocus.y1 += fark;
          tempFocus.y2 += fark;
        }
      };

      if( tempFocus.x1 < 0 ){ tempFocus.x1 = 0 };
      if( tempFocus.y1 < 0 ){ tempFocus.y1 = 0 };
      if( tempFocus.x2 > lenna.w ){ tempFocus.x2 = lenna.w };
      if( tempFocus.y2 > lenna.h ){ tempFocus.y2 = lenna.h };

      //////////////////// yarı kesi yarı klon
      var gx = tempFocus.w;
      var gy = tempFocus.h;
      if ( tempFocus.w > lenna.w){ 
        gx = lenna.w;
        tempFocus.x1 = 0;
      };
      if ( tempFocus.w > lenna.h ){ 
        gy = lenna.h; 
        tempFocus.y1 = 0;
      };
   
      image.crop(tempFocus.x1, tempFocus.y1, gx, gy); //////////////
      tempFocus.x1 = 0;
      tempFocus.y1 = 0;
      tempFocus.x2 = gx;
      tempFocus.y2 = gy;
    }
    if ( tempFocus.w > lenna.w || tempFocus.h > lenna.h ){
        if( tempFocus.w > lenna.w && tempFocus.h > lenna.h){
          var temp = clones.verticalClone( image, tempFocus, focusArea );
          var reCanvas = clones.horizontalClone( temp, tempFocus, focusArea );
      
        }else if( tempFocus.w > lenna.w || tempFocus.h > lenna.h ){
          if( tempFocus.h > image.bitmap.height ){
              var reCanvas = clones.verticalClone ( image, tempFocus, focusArea );
          }
          else if(tempFocus.w > image.bitmap.width){
              reCanvas = clones.horizontalClone( image, tempFocus, focusArea );
          }
        };
        image = reCanvas;
        }


  image.resize(result.w, Jimp.AUTO);
  image.quality(result.q);
  image.write("newpic19.jpg");
});

