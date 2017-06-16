import readMarkers from '../markers'

import Segment from './Segment'

export default class ParsedJpeg {

  constructor(file, buffer) {
    //<FileData>, ArrayBuffer

    this.file = file
    this.buffer = buffer

    this.markers = readMarkers(this.buffer)
    this.segments = this.markers.map(marker => new Segment(marker, this.buffer))
  }


}
