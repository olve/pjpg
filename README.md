parsejpeg
============
A collection of functions for reading and parsing segments of bytes in JPEG files.

### index:
- readAdobe
- readComment
- readIPTC
- readJFIF
- readMarkers
- readMicrosoftPadding
- readSegment
- exif
- util
- app1
- dict



Example Usage
------------
```Javascript
//Sample code that loads a JPEG and console.logs some EXIF metadata if the file has any.

import * as parsejpeg from 'parsejpeg'

//load a JPEG file, make a buffer
const jpeg = {} //A JPEG-file selected with drag&drop or whatever
const buffer = new FileReaderSync().readAsArrayBuffer(jpeg)

//build a list of every JPEG marker in the file
const markers = parsejpeg.readMarkers(jpeg)

markers.forEach(marker => {

	//APP1 segment (usually exif/adobe metadata)
	if (marker.byteMarker === 0xFFE1) {

		//get the ID of the APP1-segment to determine the type
		const id = parsejpeg.app1.readID(marker.offset, buffer)
		if (id === 'Exif') {

			//read the segment as EXIF metadata
			const exif = parsejpeg.exif.readExif(marker.offset, buffer)


			//console.log every tag in the first Image File Directory (IFD0)
			if (exif.hasOwnAttribute('ifd0')) {
				exif.ifd0.tagList.forEach(tag => {
					const valueReadableByHumans = parsejpeg.dict.parseValue(tag, parsejpeg.dict.tiff.image)
					console.log(`${tag.name}: ${valueReadableByHumans}`)
				})
			}
		}

	}
})

```

Dictionaries
------------
there are a number of dictionary-like objects that can be used to convert raw tag values to something more legible.

##### dicts:
- **dict.tiff.image** (information about tags stored in IFD0/IFD1. General Image tags)
- **dict.tiff.photo** (information about tags stored in Exif sub-IFDs. Photography tags from digital cameras)
- **dict.tiff.gps** (information about tags stored in GPS sub-IFDs.)
- **dict.tiff.iop** (information about tags stored in IOP sub-IFDS (Interoperability information))

- **dict.iptc.envelope** (8BIM tag information)
- **dict.iptc.application2** (8BIM tag information)

- **dict.jpeg** (names of JPEG bytemarkers)
