js-read-jpeg
============

A collection of functions for reading and parsing segments of bytes in JPEG files.

Example Usage
------------
```Javascript
//Sample code that loads a JPEG and console.logs some EXIF metadata if the file has any.

//load a JPEG file, make a buffer
var jpeg = {}; //A JPEG-file selected with drag&drop or whatever
var reader = new FileReaderSync()
var buffer = reader.readAsArrayBuffer(jpeg);

//build a list of every JPEG marker in the file
var markers = findJpegMarkers(buffer);

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

Dictionaries
------------
There are a number of dictionary-like objects in several of the files that can be used to convert raw values to something more legible by humans; most notably in app1.dictionary.js which holds a number of methods for converting raw EXIF-tags to text values.

Files with dictionary-objects:
app1.dictionary.js:
* TIFF_IMAGE_TAGS (information about tags stored in IFD0/IFD1. General Image tags)
* TIFF_PHOTO_TAGS (information about tags stored in Exif sub-IFDs. Photography tags from digital cameras)
* TIFF_GPS_TAGS (information about tags stored in GPS sub-IFDs.)
* TIFF_IOP_TAGS (information about tags stored in IOP sub-IFDS (Interoperability information))

iptc.js: 
* IPTC_ENVELOPE_TAGS (8BIM tag information)
* IPTC_APPLICATION2_TAGS (8BIM tag information)

markers.js:
* JPEG_MARKERS (names of JPEG bytemarkers)
