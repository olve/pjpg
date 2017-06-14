export default function readComment(offset, buffer) {

  /*	read COM Comment from JPEG to string
  	  	arguments:
    			offset: offset of COM marker in the file.
    			buffer: JPEG file as byteArray,
   */

   const view = new DataView(buffer)
   const array = new Uint8Array(buffer)

   const length = view.getUint16(offset+2) + 2

   let comment = ''
   for (let i = offset+4, stop = offset+length; i < stop; i++) {
     comment += String.fromCharCode(array[i])
   }

   return comment

}
