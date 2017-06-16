import readMarkers from '../read/markers'

import Segment from './Segment'

export default class ParsedJpeg {

  constructor(buffer) {
    //buffer: JPEG file as ArrayBuffer

    this.buffer = buffer

    this.markers = readMarkers(this.buffer)
    this.segments = this.markers.map(marker => new Segment(marker, this.buffer))
  }


}
