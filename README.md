js-read-jpeg
============

A collection of functions for reading segments of a JPEG file.


Example Usage
------------

```Javascript
//load a JPEG and console.log every tag in the first IFD if there is EXIF metadata present in the JPEG.

//load a JPEG file, make a buffer
var jpeg = {}; //A JPEG-file selected with drag&drop or whatever
var reader = new FileReaderSync()
var buffer = reader.readAsArrayBuffer(jpeg);

//build a list of every JPEG marker in the file
var markers = readJpegMarkersList(buffer);

//iterate over the markers, to find any EXIF segments present in the file.
markers.forEach(function(marker) {

	//APP1 segment (usually exif/adobe metadata)
	if (marker.byteMarker === 0xFFE1) {

		//get the ID of the APP1-segment to determine the type
		var id = readJpegApp1Id(marker.offset, buffer); 
		if (id === "Exif") {

			//read the segment as EXIF metadata
			var exif = readJpegExif(marker.offset, buffer);
			
			//console.log every tag in the first Image File Directory (IFD0)
			if (exif.hasOwnAttribute("ifd0")) {
				exif.ifd0.tagList.forEach(function(tag) {
					var valueReadableByHumans = parseJpegTagValue(tag, TIFF_IMAGE_TAGS);
					console.log(tag.name+": "+valueReadableByHumans);
				});
			}
		}
	}
});

```
