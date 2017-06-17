import readComment from '../read/comment'

export default function parseComment(segment) {

  const value = readComment(segment.marker.offset, segment.jpeg)
  const bytes = function() {

    const len = value.length
    const _bytes = [0xFF, 0xFF, len(+2) >> 8, (len+2) & 255]

    value.forEach(letter => _bytes.push(letter.charCodeAt()))

    return _bytes

  }

  return { value, bytes }

}
