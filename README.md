js-read-jpeg
============

A collection of functions for reading segments of a JPEG file.


Example Usage
------------

```Javascript
//load a jpeg and console.log every tag in the first IFD if there is EXIF metadata present in the JPEG.

//load a JPEG file, make a buffer
var jpeg = {}; //A JPEG-file selected with drag&drop or whatever
var reader = new FileReaderSync()
var buffer = reader.readAsArrayBuffer(jpeg);

var markers = readJpegMarkersList(buffer); //build a list of every JPEG marker in the file

markers.forEach(function(marker) {
	if (marker.byteMarker === 0xFFE1) { //APP1 segment (usually exif/adobe metadata)
		var id = readJpegApp1Id(marker.offset, buffer); //get the ID of the APP1-segment to determine the type
		if (id === "Exif") {
			var exif = readJpegExif(marker.offset, buffer); //read the segment as EXIF data
			if (exif.hasOwnAttribute("ifd0")) {
				exif.ifd0.tagList.forEach(function(tag) { //iterate over every tag in the first Image File Directory
					var valueReadableByHumans = parseJpegTagValue(tag, TIFF_IMAGE_TAGS);
					console.log(tag.name+": "+valueReadableByHumans);
				});
			}
		}
	}
});

```