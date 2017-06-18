export adobe from './adobe'
export comment from './comment'
export exif from './exif'
export generic from './generic'
export microsoftPadding from './microsoftPadding'
export scan from './scan'

import readMarkers from '../read/markers'
import Segment from './Segment'

class ParsedJpeg {

  constructor(buffer) {
    //buffer: JPEG file as ArrayBuffer

    this.buffer = buffer

    this.markers = readMarkers(this.buffer)
    this.segments = this.markers.map(marker => new Segment(marker, this.buffer))
  }


}



////buffer: JPEG file as ArrayBuffer
export default function parseJpeg(buffer) { return new ParsedJpeg(buffer) }
