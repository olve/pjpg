import readGeneric from '../read/generic'

export default function parseGeneric(segment) {

  return {
    value: null,
    bytes: function() {
      return readGeneric(segment.offset, segment._buffer)
    }
  }

}
