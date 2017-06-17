import microsoftPadding from './parse/microsoftPadding'
import comment from './parse/comment'
import adobe from './parse/adobe'

import { readID } from './read/app1'
import { readExif } from './read/exif'

export default class Segment {
  constructor(jpeg, marker) {
    this.jpeg = jpeg
    this.marker = marker

    const {bytes, value} = this.defineType()

    this.bytes = bytes
    this.value = value

  }

  defineType() {
    switch (this.marker.byteMarker) {

      case 0xEA1C: //microsoft padding
        return microsoftPadding(this)

      case 0xFFFE: //COM Comment
        return comment(this)

      case 0xFFE1: //APP1 (Exif/Adobe)
        const id = readID(this.marker.offset, this.jpeg)

        if (id === 'Exif') {
          return readExif(this.marker, this.jpeg)
        }
        else if (id.toLowerCase().includes('adobe')) {
          return adobe(this)
        }

    }
  }



}
