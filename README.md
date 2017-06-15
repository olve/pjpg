pjpg - parse jpegs
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

import fs from 'fs'
import pjpg from 'pjpg'

//load a JPEG file, make a buffer
const jpeg = fs.readFileSync('./IMG_0466.jpg')
const buffer = new ArrayBuffer(jpeg.byteLength)
new Uint8Array(buffer).set(jpeg)

//build a list of every JPEG marker in the file
const markers = pjpg.readMarkers(buffer)

markers.forEach(marker => {

	//APP1 segment (usually exif/adobe metadata)
	if (marker.byteMarker === 0xFFE1) {

		//get the ID of the APP1-segment to determine the type
		const id = pjpg.app1.readID(marker.offset, buffer)
		if (id === 'Exif') {

			//read the segment as EXIF metadata

			const exif = pjpg.exif.readExif(marker.offset, buffer)

			//console.log every tag in the first Image File Directory (IFD0)
			if (exif.hasOwnProperty('ifd0')) {
				exif.ifd0.tagList.forEach(tag => {
					const valueReadableByHumans = pjpg.dict.tiff.image.parseValue(tag)
					const tagName = pjpg.dict.tiff.image.getValue(tag.id, 'name')
					console.log(`${tagName}: ${valueReadableByHumans}`)
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
