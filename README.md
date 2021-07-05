# Image-Processing-with-Jimp
Node.js and Jimp 

This project mainly have to process the defined image with the inputs: 
1- Certain focus area coordinates: ( Don’t select the parts which is repetitive )
2- Requested result and quality
   Situation 1: ( Result area  <  focus area )
   Situation 2: ( Result area  > focus area )
   Situation 3: ( Result area  >  image ( use clones to make the image bigger) )
   Situation 4: [ Result area’s width  <  image’s width ( use crop method ); Result area’s height  > image’s height ( use clones ) ]

Following features implemented in the code:
-> The focus area is exactly in the desired new proportioned image, not cropped and not repeated
-> İf focus area adhered to any edge of the original image, repeat(clone) on other suitable edges.
-> Maintain the ratio equality and if that is necessary update the ratio of focus area according to ratio of requested result and produce a new image.

Except situation 3 the main code provides all the aspects. Additionally clone4.js resolves the problem separately.
