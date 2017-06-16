export function readID(offset, jpeg) {
/*	read The ID following an APP1 marker, used to tell APP1 types apart (adobe/exif)
		arguments:
			offset: offset of an APP1 marker in a JPEG file
			buffer: JPEG file as byteArray
*/
	var array = jpeg.array

	var id = "";
	for (var i = offset + 4; i < array.byteLength; i++) {
		var charcode = array[i];
		if (charcode === 0) break;
		id += String.fromCharCode(charcode);
	}
	return id;
}
export function readLength(offset, jpeg) {
/* read APP1 segment length
		arguments:
			offset: offset of the App1 marker in the file.
			buffer: JPEG file as byteArray
*/
	var view = jpeg.view
	return view.getUint16(offset+2);
}
