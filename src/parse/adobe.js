import readAdobe from '../read/adobe'
import {readLength} from '../read/app1'

export default function parseAdobe(segment) {
  const { xml } = readAdobe(segment.offset, segment._buffer)

  return {
    value: xml,
    bytes: function() {
      const array = new Uint8Array(segment._buffer)
      const end = segment.offset + 32 + readLength(segment.offset, segment._buffer)
      return Array.from(array.slice(segment.offset, end))
    }
  }

}
