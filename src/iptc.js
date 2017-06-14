export default function readIPTC(offset, buffer) {
  /*	read 8BIM metadata stored in a JPEG as IPTC.
  	  	arguments:
    			buffer: JPEG file as byteArray,
    			offset: offset of IPTC marker in the file.
    	Note:
    		IPTC 8BIM tags are either strings (most common), unsigned chars, or unsigned shorts.
    		The tag stored in the file does not record any information about it's type, but you can look it up by the tag ID.
   */


   const array = new Uint8Array(buffer)
   const view = new DataView(buffer)

   const nameHeaderLength = array[offset+7]
   if (nameHeaderLength & 2 !== 0) nameHeaderLength += 1
   if (nameHeaderLength === 0) nameHeaderLength = 4

   const start = offset + 8 + nameHeaderLength
   const length = view.getUint16(offset + 6 + nameHeaderLength)

   const tags = {}

   for (let offset = start, stop = start+length; offset < stop; offset++) {
     if ( array[offset] === 0x1C & array[offset+1] === 0x02 ) {
       const id = array[offset+2]
       const byteLength = view.getUint16(offset+3)
       const raw = Array.from(new Uint8Array(buffer, offset+5, byteLength))

       tags[id] = { id, raw }

     }
   }

   return {
     length,
     tags,
   }

}
