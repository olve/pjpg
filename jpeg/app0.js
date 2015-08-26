function readJpegJFIF(offset, buffer) {
/*	read JFIF (App0) 
	  	arguments: 
  			offset: offset of the JFIF (App0) marker in the file.
  			buffer: JPEG file as byteArray,
  	Note:
  		JFIF/JFXX is used for embedding thumbnails.
  		Reading JFXX is not yet implemented.
*/

	var view = new DataView(buffer);
	var array = new Uint8Array(buffer);

	var length = view.getUint16(offset+2);
	var id = "";
	for (var i = offset+4, len = offset+8; i < len; i++) {
		id += String.fromCharCode(array[i]);
	}
	if (id === "JFIF") {
		var self = {
			id: id,
			length: length,
			version: array[offset+9] + "." + array[offset+10],
			densityUnits: array[offset+11],
			xDensity: view.getUint16(offset+12),
			yDensity: view.getUint16(offset+14),
			thumbnailWidth: array[offset+16],
			thumbnailHeight: array[offset+17],
		};
		var start = offset + 18;
		var stop = offset + 18 + (3*self.thumbnailWidth*self.thumbnailHeight);

		//embedded thumbnail image-data as array of bytes.
		self.data = (start === stop) ? null : Array.prototype.slice.call(array).slice(start, stop);
		return self;
	}
	else if (id === "JFXX") {
		return {
			id: id,
			length: length,
			thumbnailFormat: array[offset+9],
			data: null, //http://en.wikipedia.org/wiki/JPEG_File_Interchange_Format#JFIF_extension_.28JFXX.29_segment_format
		};
	}

	return null;
};