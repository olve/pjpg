import Jpeg from './Jpeg'

export default function parseJpeg(file, buffer) {
  //<FileData>, ArrayBuffer
  
  return Jpeg(file, buffer)
}
