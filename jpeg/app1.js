/* 
	APP1, Application segment 1, bytemarker 0xFFE1, is a JPEG marker used to store EXIF-information, Adobe XML information, and probably more.

	A note on JPEGs edited by Windows:
        Any JPEG edited by Windows will most likely contain a handful of "Padding" markers: 0xea1c.
        Windows adds more data to Exif metadata by finding "dead zones" in the file, and storing data there
        (They are mostly gigantic arrays of nullbytes)

        This method of editing/padding/adding data is patented by Windows, and is thoroughly explained in the patent specs here:
        http://www.freepatentsonline.com/7421451.html */


function readJpegApp1Id(offset, buffer) {
/*	read The ID following an APP1 marker, used to tell APP1 types apart (adobe/exif)
		arguments:
			offset: offset of an APP1 marker in a JPEG file
			buffer: JPEG file as byteArray
*/
	var array = new Uint8Array(buffer);

	var id = "";
	for (var i = offset + 4; i < array.byteLength; i++) {
		var charcode = array[i];
		if (charcode === 0) break;
		id += String.fromCharCode(charcode);
	}
	return id;
}
function readJpegApp1Length(offset, buffer) {
/* read APP1 segment length
		arguments: 
			offset: offset of the App1 marker in the file.
			buffer: JPEG file as byteArray
*/
	var view = new DataView(buffer);
	return view.getUint16(offset+2);
}
function readJpegAdobe(offset, buffer) {
/*	read Adobe XML (App1) 
	  	arguments: 
  			offset: offset of the Adobe (App1) marker in the file.
  			buffer: JPEG file as byteArray,
  	Note:
  		Exif does also use APP1 markers. You can tell adobe and exif App1s apart by an ASCII string which follows directly after the APP1 size-marker.
*/
	var array = new Uint8Array(buffer);

	var start = offset + 32;
	var length = readJpegApp1Length(offset, buffer);
	var stop = start + length;
	var xml = "";

	for (var i = start; i < stop; i++) {
		xml += String.fromCharCode(buffer[i]);
	}

	return {
		xml: xml,
		length: length,
	};
}
function readJpegExif(offset, buffer) {
/*	read Exif tags (App1 marker) 
	  	arguments: 
  			offset: offset of the Exif (App1) marker in the file.
  			buffer: JPEG file as byteArray,
  	Note:
  		Adobe use APP1 markers for their XML data. You can tell adobe and exif App1s apart by an ASCII string which follows directly after the APP1 size-marker.
*/

	var view = new DataView(buffer);
	var array = new Uint8Array(buffer);

	//total exif data length (does NOT include the app1-marker itself, but DOES include the bytes denoting the length)
	var length = readJpegApp1Length(offset, buffer);

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
function readIFD(offset, tiff, view, littleEndian) {
	//read exif Image File Directory

	var offset = tiff + offset; //offsets and address references consider the beginning of the tiff-header position 0.
	var entries = view.getUint16(offset, littleEndian); //number of tag entries in the ifd

	var tags = {};
	var tagList = [];

	for (var i = 0; i < entries; i++) {

		var tagOffset = offset + 2 + i*12;
		var tagId = view.getUint16(tagOffset, littleEndian);
		var tag = readTag(tagId, tagOffset, tiff, view, littleEndian);
		if (tag !== null) {
			tags[tagId] = tag;
            tagList.push(tag);
		}
	}

	//after all the tag entries, the offset of the next linked IFD is stored as an unsigned long. if it is 0, there are no linked IFDs.
	var next = view.getUint32(offset + (entries*12) + 2, littleEndian);
	return {
		entries: entries,
		tags: tags,
		tagList: tagList,
		next: next,
	};
}

function readTag(id, offset, tiff, view, littleEndian) {

	if (id === 0xEA1C) return null; //Windows padding tags. We skip these. They link to gigantic arrays of null bytes.

	function slice(method, start, stop) {
		//Applies method to view to read bytes. Returns array of bytes.
		//for example, if method == DataView.prototype.getUint8, do view.getUint8(i) for every offset between <start,stop>
		if (start === stop) return [method.apply(view, [start, littleEndian])];
		var values = [];
		for (var i = start; i < stop; i++) {
			var value = method.apply(view, [i, littleEndian]);
			values.push(value);
		}
		return values;		
	}

    /* Functions for reading each type of tag, and bytesize per component of a tag.
    The total bytelength of a tag-value is numberOfComponents*bytesize
    example: a tag of type 3 (unsigned short) with 2 components would be have a value with a bytelength of 4. <2 components> * <2 bytes per component> = 4.
    all read-functions return an array of values.

    example return values for [0xFF,0xFF,0,0,0x41,0x42]:

        type 1, unsigned chars: [255, 255, 0, 0, 65, 66] 
        type 2, ascii character: ["ÿ", "ÿ", 0, 0, "A", "B"]
        type 3, unsigned short: [65535, 0, 25958]
    ================================================ */
	var types = {
        //unsigned byte
		1: {size: 1, read:function(components, valueOffset) {return slice(DataView.prototype.getUint8, valueOffset, (valueOffset+components));},},

        //ascii string
		2: {size: 1, read:function(components, valueOffset) {
				var charcodes = slice(DataView.prototype.getUint8, valueOffset, (valueOffset+components));
				var values = [];
				for (var i=0; i<charcodes.length; i++) {
					values.push(String.fromCharCode(charcodes[i]));
				}
				return values;
			},
		},

        //unsigned short
		3: {size: 2, read:function(components, valueOffset) {return slice(DataView.prototype.getUint16, valueOffset, (valueOffset-2+(2*components)));},},

        //unsigned long
		4: {size: 4, read:function(components, valueOffset) {return slice(DataView.prototype.getUint32, valueOffset, (valueOffset-4+(4*components)));},},

        //unsigned rational
		5: {size: 8, read:function(components, valueOffset) {
				var values = [];
				for (var i=0; i < components; i++) {
					var numerator = view.getUint32(valueOffset + i*8, littleEndian);
					var denominator = view.getUint32(valueOffset + 4 + i*8, littleEndian);
					var value = numerator/denominator;
					if (isNaN(value)) value = 0; //division by zero
					values[i] = value;
				}
				return values;
			},
		},

        //signed byte
		6: {size: 1, read:function(components, valueOffset) {return slice(DataView.prototype.getInt8, valueOffset, (valueOffset+components));},},

        //undefined (unsigned byte)
		7: {size: 1, read:function(components, valueOffset) {return slice(DataView.prototype.getUint8, valueOffset, (valueOffset+components));},},

        //signed short
		8: {size: 2, read:function(components, valueOffset) {return slice(DataView.prototype.getInt16, valueOffset, (valueOffset-2+(2*components)));},},

        //signed long
		9: {size: 4, read:function(components, valueOffset) {return slice(DataView.prototype.getInt32, valueOffset, (valueOffset-4+(4*components)));},},

        //signed rational
		10: {size: 8, read:function(components, valueOffset) {
				var values = [];
				for (var i=0; i < components; i++) {
					var numerator = view.getInt32(valueOffset + i*8, littleEndian);
					var denominator = view.getInt32(valueOffset + 4 + i*8, littleEndian);
					var value = numerator/denominator;
					if (isNaN(value)) value = 0; //division by zero
					values[i] = value;
				}
				return values;
			},
		},

        //single float
		11: {size: 4, read:function(components, valueOffset) {return slice(DataView.prototype.getFloat32, valueOffset, (valueOffset-4+(4*components)));},},

        //double float
		12: {size: 8, read:function(components, valueOffset) {return slice(DataView.prototype.getFloat64, valueOffset, (valueOffset-8+(8*components)));},},
	};

	var type = view.getUint16(offset+2, littleEndian);
	if (!types.hasOwnProperty(type)) return null; //we don't know how to read this type of tag. probably, the provided offset does not match the beginning of a tag entry


	var components = view.getUint32(offset+4, littleEndian);
	var componentSize = types[type].size;
	var byteLength = componentSize*components;

	var pointer = tiff + view.getUint32(offset+8, littleEndian);

    // Tags with byteLength < 4 will be stored in the IFD0 data area, instead of following the tag.
    // We must determine the actual offset of where the value is stored:
	if (components === 1) var valueOffset = (type === 5 || type === 10) ? pointer : (offset + 8);
	else var valueOffset = (byteLength>4) ? pointer : (offset + 8);

	var bytes = Array.prototype.slice.call(new Uint8Array(view.buffer, valueOffset, byteLength));
	var value = types[type].read(components, valueOffset);

	return {

		id: id,
		type: type,
		bytes: bytes,
		value: value,
		byteLength: byteLength,
		components: components,
		componentSize: componentSize,
		littleEndian: littleEndian,		

	};

}