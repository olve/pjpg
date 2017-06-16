import { readID } from '../read/app1'

import parseMicrosoftPadding from './microsoftPadding'
import parseGeneric from './generic'
import parseComment from './comment'
import parseAdobe from './adobe'
import parseExif from './exif'

export default class Segment {
  constructor({offset, name, byteMarker}, buffer) {
    /*  marker: { offset, name, byteMarker } */

    this._buffer = buffer

    this.offset = offset,
    this.name = name
    this.byteMarker = byteMarker
    this.includeInSavedFile = true

    this.data = this.parse()

  }

  parse() {
    switch (this.byteMarker) {

      case 0xEA1C: //microsoft padding
        return parseMicrosoftPadding(this)

      case 0xFFFE: //COM Comment
        return parseComment(this)

      case 0xFFE1: //App1 (almost always Exif or Adobe)
        const id = readID(this.offset, this._buffer)
        if (id === 'Exif')             return parseExif(this)
        else if (id.includes('adobe')) return parseAdobe(this)
        else                           return parseGeneric(this)
    }
  }

}
