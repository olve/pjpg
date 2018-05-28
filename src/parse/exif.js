import {readExif} from '../read/exif'

export default function parseExif(segment) {
  const exif = readExif(segment.offset, segment._buffer)

  return {
    value: exif,
    bytes: _ => [],
  }

}
