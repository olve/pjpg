function readJpegGenericSegment(offset, buffer) {
	var view = new DataView(buffer);
	var array = new Uint8Array(buffer);

	var length = view.getUint16(offset + 2);
	var end = length + offset + 2;

	return Array.prototype.slice.call(array).slice(offset, end);
}