import readLength from './length'

export default function readAdobeXML(offset, buffer) {
/*	read Adobe XML (App1)
	  	arguments:
  			offset: offset of the Adobe (App1) marker in the file.
  			buffer: JPEG file as byteArray,
  	Note:
  		Exif does also use APP1 markers. You can tell adobe and exif App1s apart by an ASCII string which follows directly after the APP1 size-marker.
*/
	const array = new Uint8Array(buffer)

	const start = offset + 32
	const length = readLength(offset, buffer)
	const stop = start + length
	let xml = ''

	for (let i = start; i < stop; i++) {
		xml += String.fromCharCode(array[i])
	}

	return { xml, length }
}
