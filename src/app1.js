module.exports.readID = function readID(offset, buffer) {
/*	read The ID following an APP1 marker, used to tell APP1 types apart (adobe/exif)
		arguments:
			offset: offset of an APP1 marker in a JPEG file
			buffer: JPEG file as byteArray
*/
	var array = new Uint8Array(buffer);

	var id = "";
	for (var i = offset + 4; i < array.byteLength; i++) {
		var charcode = array[i];
		if (charcode === 0) break;
		id += String.fromCharCode(charcode);
	}
	return id;
}
module.exports.readLength = function readLength(offset, buffer) {
/* read APP1 segment length
		arguments:
			offset: offset of the App1 marker in the file.
			buffer: JPEG file as byteArray
*/
	var view = new DataView(buffer);
	return view.getUint16(offset+2);
}
