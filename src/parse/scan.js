// get bytes for SOS Scan Segments (compressed image data)

export default function scan(segment, eoi) {
  // eoi: end of image marker object ending the SCAN segment (first EOI after SOS)
  return {
    value: null,
    bytes: _ => segment.array.slice(segment.marker.offset, eoi.offset)
  }
}
