function readMicrosoftPadding(offset, buffer) {
	/*	returns a block of microsoft padding as an array of bytes
		the microsoft padding marker is 0xEA1C, and the specs for Microsoft padding are here:
		http://www.freepatentsonline.com/y2007/0050321.html (Figures 4, 5, and 10 are particularly relevant.
	 */
	var array = new Uint8Array(buffer);
	var view = new DataView(buffer);

	var length = view.getUint16(offset+6);
	var end = offset + 6 + length;

	return Array.prototype.slice.call(array).slice(offset, end);
}