const { default: png } = require("@jimp/png");
var Jimp = require('jimp');

function verticalClone( image, result, focusArea ){
  var lenna = { w: image.bitmap.width, h: image.bitmap.height };
  var resultCanvas = new Jimp(lenna.w, result.h );
 
  var temp = image.clone();
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

  //KORUMALI SINIR VAR MI?
  if(focusArea.y1 == 0 ){
      temp = image.clone();
      var gaph1 = 0;
      var gaph2 = resultCanvas.bitmap.height - image.bitmap.height;
      resultCanvas.composite( temp, 0, gaph1 ); 
  }
  else if(focusArea.y2 == lenna.h){
      temp = image.clone(); 
      gaph1 = resultCanvas.bitmap.height - image.bitmap.height;
      gaph2 = 0;
      resultCanvas.composite( temp, 0, gaph1 ); 
  }
  else{
     temp = image.clone();
     gaph1 = resultCanvas.bitmap.height/2 - image.bitmap.height/2;
     gaph2 = gaph1;
     resultCanvas.composite( temp, 0, gaph1 ); 
  }
  
  //minicanvasA
  var gaph = gaph1;
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
  gaph = gaph2;
  var i = 0;
  var y = 0;
  while( gaph > miniCanvasB.bitmap.height ){
    resultCanvas.composite( miniCanvasB, 0, lenna.h + y + gaph1);
    gaph = gaph - miniCanvasB.bitmap.height;
    y = y + miniCanvasB.bitmap.height;
    i = i + 1;
  };
  
  if( gaph != 0 ){
    var temp = miniCanvasB.clone();
    var lastRepB = temp.crop( 0, 0, lenna.w, gaph);
    resultCanvas.composite( lastRepB, 0, lenna.h + i *  miniCanvasB.bitmap.height + gaph1 );
  }

  return resultCanvas;
};


function horizontalClone( image, result, focusArea ){
  var lenna = { w: image.bitmap.width, h: image.bitmap.height };
  var resultCanvas = new Jimp( result.w, lenna.h );

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

  //KORUMALI SINIR VAR MI?
  if(focusArea.x1 == 0 ){
      temp = image.clone();
      var gapw1 = 0;
      var gapw2 = resultCanvas.bitmap.width - image.bitmap.width;
      resultCanvas.composite( temp, gapw1, 0 ); 
  }
  else if(focusArea.x2 == lenna.w){
      temp = image.clone();
      gapw1 = resultCanvas.bitmap.width - image.bitmap.width;
      gapw2 = 0;
      resultCanvas.composite( temp, gapw1, 0 ); 
  }
  else{
      temp = image.clone();
      gapw1 = resultCanvas.bitmap.width/2 - image.bitmap.width/2;
      gapw2 = gapw1;
      resultCanvas.composite( temp, gapw1, 0 ); 
  }

  //imagerepA- gapw relation
  gapw = gapw1;
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
  gapw = gapw2;
  var i = 0;  
  var y = 0;
  while( gapw > miniCanvasB.bitmap.width){
  resultCanvas.composite( imageRepB, lenna.w + y + gapw1 , 0 );
  gapw = gapw - miniCanvasB.bitmap.width;
  i = i + 1;
  y = y + miniCanvasB.bitmap.width;
};

if(gapw != 0 ){
  var temp = miniCanvasB.clone();
  var lastRepB = temp.crop( 0, 0, gapw, lenna.h );
  resultCanvas.composite( lastRepB, lenna.w + i * miniCanvasB.bitmap.width + gapw1 , 0 );
}

  return resultCanvas;
};

module.exports ={
  horizontalClone: horizontalClone,
  verticalClone: verticalClone
};

