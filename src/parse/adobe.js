import readAdobe from '../read/adobe'
import {readLength} from '../read/app1'

export default function parseAdobe(segment) {

  const {offset} = segment.marker


  const { xml } = readAdobe(offset, segment.jpeg)

  return {
    value: xml,
    bytes: function() {
      const end = offset + 32 + readLength(offset, segment.jpeg)
      return Array.from(segment.jpeg.array.slice(segment.offset, end))
    }
  }

}
