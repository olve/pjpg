export default function readId(offset, buffer) {
/*	read The ID following an APP1 marker, used to tell APP1 types apart (adobe/exif)
		arguments:
			offset: offset of an APP1 marker in a JPEG file
			buffer: JPEG file as byteArray
*/

  const array = new Uint8Array(buffer)

  let id = ''

  for (let i = offset+4; i < array.byteLength; i++) {
    const charcode = array[i]
    if (charcode === 0) break
    id += String.fromCharCode(charcode)
  }

  return id
}
