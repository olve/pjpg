
import JPEG_MARKERS from './dictionary/JPEG'

export default function readMarkers(buffer) {

  /*
    Reads all markers found in a jpeg ArrayBuffer to an array of:
      {
        offset: 'offset of marker',
        name: 'marker name',
        byteMarker: 'bytemarker, e.g. 0xFFE1 (EXIF marker)'
      }
  */

  const array = new Uint8Array(buffer)
  const markers = []

  array.forEach((byte, offset) => {

    if (byte === 0xFF) {

      let marker = array[offset+1]

      if (marker !== 0xFF && marker !== 0) { //found 0xFF,0xFF (beginning of a marker)

        marker += (0xFF << 8)
        markers.push({
          offset,
          name: JPEG_MARKERS[marker],
          byteMarker: marker,
        })

      }
    }

    else if (byte === 0xEA && array[offset+1] === 0x1C) { //found 0xEA, 0x1C (windows padding marker)
      markers.push({
        offset,
        name: JPEG_MARKERS[0xEA1C],
        byteMarker: 0xEA1C
      })
    }
    else if (byte === 0x38) {         //8
      if (
          array[offset+1] === 0x42 && //B
          array[offset+2] === 0x49 && //I
          array[offset+3] === 0x4D && //M
          array[offset+4] === 0x04 &&
          array[offset+5] === 0x04
      ) {                            //found 8bim (iptc) marker
        markers.push({
          offset,
          name: 'iptc',
          byteMarker: 0x38
        })
      }
    }

  })

  return markers

}
