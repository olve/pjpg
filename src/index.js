export readMicrosoftPadding from './read/microsoftPadding'
export readComment from './read/comment'
export readMarkers from './read/markers'
export readSegment from './read/generic'
export readAdobe from './read/adobe'
export readIPTC from './read/iptc'
export readJFIF from './read/jfif'
export readExif from './read/exif'
export app1 from './read/app1'
export dict from './dict'
export util from './util'
export parse from './parse'

import readMarkers from './read/markers'
import Segment from './Segment'

export default class JPEG {
  constructor(buffer) {
    //buffer: JPEG File as ArrayBuffer

    this.buffer = buffer
    this.view = new DataView(buffer)
    this.array = new Uint8Array(buffer)

    this.markers = readMarkers(this)

  }

  getSegments() {
    return this.markers.map(marker => new Segment(this, marker))
  }


}
