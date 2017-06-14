export default function readLength(offset, buffer) {
/* read APP1 segment length
		arguments:
			offset: offset of the App1 marker in the file.
			buffer: JPEG file as byteArray
*/
	const view = new DataView(buffer)
	return view.getUint16(offset+2)
}
