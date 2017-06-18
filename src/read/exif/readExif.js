import { readLength } from '../app1'
import readIFD from './readIFD'
import readThumbnail from './readThumbnail'

export default function readExif(marker, jpeg) {
/*	read Exif tags (App1 marker)
	  	arguments:
  			offset: offset of the Exif (App1) marker in the file.
  			buffer: JPEG file as byteArray,
  	Note:
  		Adobe use APP1 markers for their XML data. You can tell adobe and exif App1s apart by an ASCII string which follows directly after the APP1 size-marker.
*/

  var offset = marker.offset
  var view = jpeg.view
  var buffer = jpeg.buffer

	//total exif data length (does NOT include the app1-marker itself, but DOES include the bytes denoting the length)
	var length = readLength(offset, jpeg);

	var tiff = offset + 10; //starting offset of TIFF header.

    //if Intel ("II" ascii) is found here, we must read the remaining exif-data as little endian.
    //if Motorola ("MM", 0x4D4D) is found, continue reading as big endian (non-exif bytes in a JPEG are big-endian.)
	var littleEndian = false;
	var endianIndicator = view.getUint16(tiff);
	if (endianIndicator === 0x4949) {
		littleEndian = true;
	}

	var self = {
		offset: offset,
		length: length,
		littleEndian: littleEndian,
		tiff: tiff,
	};


  //next marker after APP1 marker is SOI (start of image): there is an embedded thumbnail.
  var nextMarker = jpeg.markers[marker.index+1]
  if (nextMarker.byteMarker === 0xFFD8) {
    self.readThumbnail = function() { return readThumbnail(nextMarker, jpeg) }
  }


	var ifd0offset = view.getUint32(tiff+4, littleEndian);
	self.ifd0 = readIFD(ifd0offset, tiff, view, littleEndian);

	//offset to Exif IFD (camera/photo information tags) is stored as a tag value in IFD0.
	if (self.ifd0.tags.hasOwnProperty(0x8769)) {
		self.exif = readIFD(self.ifd0.tags[0x8769].value[0], tiff, view, littleEndian);

		//offset to IOP IFD (Interoperability tags) is stored as a tag value in the Exif IFD.
		if (self.exif.tags.hasOwnProperty(0xa005)) {
			self.iop = readIFD(self.exif.tags[0xa005].value[0], tiff, view, littleEndian);
		}

	}

	//offset to GPS IFD is stored as a tag value in IFD0
	if (self.ifd0.tags.hasOwnProperty(0x8825)) {
		self.gps = readIFD(self.ifd0.tags[0x8825].value[0], tiff, view, littleEndian);
	}

	//next linked IFD, IFD1 stores tags with information about an embedded thumbnail.
    //link to next IFD (explained in IFD-constructor below)
    //because the max amount of tags in an IFD is 65536, there is usually only ifd1 if there are any linked IFDs at all.
	if (self.ifd0.next) {
		self.ifd1 = readIFD(self.ifd0.next, tiff, view, littleEndian);
	}

	return self;

};
