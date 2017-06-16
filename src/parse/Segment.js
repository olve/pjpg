import pjpg from 'pjpg'

import parseMicrosoftPadding from './parse/microsoftPadding'
import parseGeneric from './parse/generic'
import parseComment from './parse/comment'
import parseAdobe from './parse/adobe'
import parseExif from './parse/exif'

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
        const id = pjpg.app1.readID(this.offset, this._buffer)
        if (id === 'Exif') return parseExif(this)
        else if (id.includes('adobe')) return parseAdobe(this)
        else return parseGeneric(this)
    }
  }

}
