export default function readJFIF(offset, buffer) {
/*	read JFIF (App0)
	  	arguments:
  			offset: offset of the JFIF (App0) marker in the file.
  			buffer: JPEG file as byteArray,
  	Note:
  		JFIF/JFXX is used for embedding thumbnails.
  		Reading JFXX is not yet implemented.
*/

  const view = new DataView(buffer)
  const array = new Uint8Array(buffer)

	const length = view.getUint16(offset+2)

	let id = ''

  for (let i = offset+4, len = offset+8; i < len; i++) {
    id += String.fromCharCode(array[i])
  }

  if (id === 'JFIF') {

    const segment = {
      id,
      length,
      version: array[offset+9] + '.' + array[offset+10],
      densityUnits: array[offset+11],
      xDensity: view.getUint16(offset+12),
      yDensity: view.getUint16(offset+14),
      thumbnailWidth: array[offset+16],
      thumbnailHeight: array[offset+17],
    }

    const start = offset + 18
    const stop = offset + 18 + (3 * segment.thumbnailWidth + segment.thumbnailHeight)

    segment.data = (start === stop) ? null : Array.from(array).slice(start, stop)

    return segment

  }
  else if (id === 'JFXX') {
    return {
      id,
      length,
      thumbnailFormat: array[offset+9],

      //not yet implemented
      data: null //http://en.wikipedia.org/wiki/JPEG_File_Interchange_Format#JFIF_extension_.28JFXX.29_segment_format
    }
  }
  else {
    return null
  }

}
