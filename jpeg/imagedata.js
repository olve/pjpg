function readJpegGenericSegment(offset, buffer) {
	/* return raw bytes of a generic jpeg imagedata segment, a DHT or DQT segment, for example. */
	var view = new DataView(buffer);
	var array = new Uint8Array(buffer);

	var length = view.getUint16(offset + 2);
	var end = length + offset + 2;

	return Array.prototype.slice.call(array).slice(offset, end);
}