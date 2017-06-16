import Jpeg from './Jpeg'

export default function parseJpeg(buffer) {
  //buffer: JPEG file as ArrayBuffer

  return new Jpeg(buffer)
}
