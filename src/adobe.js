import { readLength } from './app1'

export default function readAdobe(offset, buffer) {
/*	read Adobe XML (App1)
	  	arguments:
  			offset: offset of the Adobe (App1) marker in the file.
  			buffer: JPEG file as byteArray,
  	Note:
  		Exif does also use APP1 markers. You can tell adobe and exif App1s apart by an ASCII string which follows directly after the APP1 size-marker.
*/
	var array = new Uint8Array(buffer);

	var start = offset + 32;
	var length = readLength(offset, buffer);
	var stop = start + length;
	var xml = "";

	for (var i = start; i < stop; i++) {
		xml += String.fromCharCode(array[i]);
	}

	return {
		xml: xml,
		length: length,
	};
}
