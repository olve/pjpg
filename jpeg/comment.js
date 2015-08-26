function readJpegComment(offset, buffer) {
/*	read COM Comment from JPEG
	  	arguments: 
  			offset: offset of COM marker in the file.
  			jpeg: JPEG file as byteArray,
 */

 	var view = new DataView(buffer);
 	var array = new Uint8Array(buffer);

 	var length = view.getUint16(offset+2) + 2; //the length-indicator itself is included in the length.

 	var comment = "";
 	for (var i = offset+4, stop = offset+length; i < stop; i++) {
 		comment += String.fromCharCode(array[i]);
 	}
 	return comment;
};