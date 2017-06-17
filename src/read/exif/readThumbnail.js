export default function readThumbnail(marker, jpeg) {

  /* The first SOI (Start of Image, 0xFFD8) marker found within an exif segment is an embedded thumbnail.
     The thumbnail ends at the first EOI (End of Image, 0xFFD9).

     args:
      marker -- object for the SOI (created by readMarkers)
      jpeg -- jpeg object

    returns:
      embedded thumbnail as array


  */

  for (let i = marker.index; i < jpeg.markers.length; i++) {
    if (jpeg.markers[i].byteMarker === 0xFFD9) {
      return Array.from(
        jpeg.array.slice(marker.offset, jpeg.markers[i].offset + 2)
      )
    }
  }

}
