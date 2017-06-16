
/*
	read a generic jpeg segment (sometimes referred to as imagedata)

	example segment:
	[0xFF,0xXX] //marker
	[0x00,0x10] //length
	[0x01]      //value
	[0x01]      //value

*/
export default function readSegment(offset, jpeg) {
	var view = jpeg.view
	var array = jpeg.array

	var length = view.getUint16(offset + 2);
	var end = length + offset + 2;

	return Array.prototype.slice.call(array).slice(offset, end);
}
