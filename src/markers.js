var jpeg = require('./dict').jpeg

/*
  read all markers from a jpeg array buffer to an array
*/

module.exports = function readMarkers(buffer) {

    var array = new Uint8Array(buffer);

    var markers = [];

    for (var offset = 0, len = array.byteLength; offset < len; offset++) {

        if (array[offset] === 0xFF) {
            var marker = array[offset+1];
            if (marker !== 0xFF && marker !== 0) {
                marker += (0xFF<<8);
                markers.push({
                    offset: offset,
                    name: jpeg[marker],
                    byteMarker: marker,
                });
            }
        }
        else if (array[offset] === 0xEA) {
          if (array[offset+1] === 0x1C) {
            markers.push({
              offset: offset,
              name: jpeg[0xEA1C],
              byteMarker: 0xEA1C,
            });
          }
        }
        else if (array[offset] === 0x38) { //8
            if (
                array[offset+1] === 0x42 && //B
                array[offset+2] === 0x49 && //I
                array[offset+3] === 0x4D && //M
                array[offset+4] === 0x04 &&
                array[offset+5] === 0x04
            ) {
                markers.push({
                    offset: offset,
                    name: "iptc",
                    byteMarker: 0x38,
                });
            }
        }
    }
    return markers;
}
