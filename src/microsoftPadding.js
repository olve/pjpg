export default function readMicrosoftPadding(offset, buffer) {
  
	/*	returns a block of microsoft padding as an array of bytes
		the microsoft padding marker is 0xEA1C, and the specs for Microsoft padding are here:
		http://www.freepatentsonline.com/y2007/0050321.html (Figures 4, 5, and 10 are particularly relevant.
	 */

   const array = new Uint8Array(buffer)
   const view = new DataView(buffer)

   const length = view.getUint16(offset+6)
   const end = offset + 6 + length

   return Array.from(array).slice(offset, end)
}
