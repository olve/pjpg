import microsoftPadding from './parse/microsoftPadding'
import comment from './parse/comment'
import adobe from './parse/adobe'
import generic from './parse/generic'
import scan from './parse/scan'
import exif from './parse/exif'

import { readID } from './read/app1'

export default class Segment {
  constructor(jpeg, marker) {
    this.jpeg = jpeg
    this.marker = marker

    const { bytes, value } = this.defineType()

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
          return exif(this)
        }
        else if (id.toLowerCase().includes('adobe')) {
          return adobe(this)
        }
        else return generic(this)

      case 0xFFE2: //APP2
      case 0xFFED: //APP13
        this.jpeg.spliceMarkerWithLengthIndicator(this.marker) //remove embedded thumbs
        return generic(this)

      case 0xFFDA: //SOS (Start of Scan)
      /*	SOS indicates the start of compressed data.
          These segments contain many jpeg markers, but do not have a length indicator; one can only find the end
          by decoding the segment.
          Removing every marker until next EOI marker instead. */

          let eoi = this.jpeg.markers[this.jpeg.markers.length-1] //default to last marker in file, in case we cant find a trailing EOI marker.

          this.jpeg.markers.slice(this.marker.index, this.jpeg.markers.length).forEach(marker => {
            if (marker.byteMarker === 0xFFD9) {
              eoi = marker
            }
          })

          this.jpeg.spliceMarkers(this.marker.index, this.marker.offset, eoi.offset)
          return scan(this, eoi)

      default:
        return { value: null, bytes: null }

    }
  }



}
