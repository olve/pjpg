export default function readIPTC(offset, buffer) {
/*	read 8BIM metadata stored in a JPEG as IPTC.
	  	arguments:
  			buffer: JPEG file as byteArray,
  			offset: offset of IPTC marker in the file.
  	Note:
  		IPTC 8BIM tags are either strings (most common), unsigned chars, or unsigned shorts.
  		The tag stored in the file does not record any information about it's type, but you can look it up by the tag ID.
 */

    var array = new Uint8Array(buffer);
    var view = new DataView(buffer);

    //find end of iptc header
	var nameHeaderLength = array[offset+7];
	if (nameHeaderLength & 2 !== 0) nameHeaderLength += 1;
	if (nameHeaderLength === 0) nameHeaderLength = 4;

	var start = offset + 8 + nameHeaderLength;
	var length = view.getUint16(offset + 6 + nameHeaderLength);

	var tags = {};

	for (var i = start, stop = start+length; i < stop; i++) {
		if (array[i] === 0x1C & array[i+1] === 0x02) { //IPTC segment marker: 0x1C 0x02
			var id = array[i+2];
			var byteLength = view.getUint16(i+3);
			var raw = Array.prototype.slice.call(new Uint8Array(buffer, i+5, byteLength));

			tags[id] = {
				id: id,
				raw: raw,
			};
		}
	}
	return {
		length: length,
		tags: tags,
	};
};
