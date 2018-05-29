import {readExif} from '../read/exif'
import { exifToBytes } from '../write/exif'
import { readLength } from '../read/app1'

export default function parseExif(segment) {

  const exif = readExif(segment.marker, segment.jpeg)


  //remove markers found within exif segment; they are from embedded images.
  const length = readLength(segment.marker.offset, segment.jpeg)
  const { index, offset } = segment.marker
  segment.jpeg.spliceMarkers(index, offset, offset+length+2)


  return {
    value: exif,
    bytes: function() { return exifToBytes(exif) },
  }

}
