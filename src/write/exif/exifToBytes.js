var Struct = require('structs.js')
import tagToBytes from './tagToBytes'

function getTagTypeInfo(type) {
	//get data-type information for an exif tag-type from the Struct lib
	switch(type) {
		case 2:
			return Struct.prototype.TYPES.c;
		case 3:
			return Struct.prototype.TYPES.H;
		case 4:
		case 5:
			return Struct.prototype.TYPES.L;
		case 6:
			return Struct.prototype.TYPES.b;
		case 8:
			return Struct.prototype.TYPES.h;
		case 9:
		case 10:
			return Struct.prototype.TYPES.l;
		case 11:
			return Struct.prototype.TYPES.f;
		case 12:
			return Struct.prototype.TYPES.d;
		case 1:
		case 7:
		default:
			return Struct.prototype.TYPES.B;
	}
}
var CompiledTag = function(tag) {
	var type = getTagTypeInfo(tag.type);
	this.value = tagToBytes(tag, type.chr);
	this.struct = new Struct();
	this.id = this.struct.push("H", tag.id);
	this.type = this.struct.push("H", tag.type);
	if (tag.type === 5 || tag.type === 10) {
		this.components = this.struct.push("L", this.value.length/8);
	}
	else {
		this.components = this.struct.push("L", this.value.length/type.size);
	}
	if (this.value.length > 4) {
		this.pointer = this.struct.push("L", 0);
	}
	else {
		if (this.value.length < 4) {
			do { //pad the value with 0s until it has the byteLength of a long (4).
				this.value.push(0);
			} while (this.value.length < 4)
		}
		this.pointer = this.struct.push("B", this.value);
	}
};
var CompiledIFD = function(offset, ifdData) {
	this.offset = offset;
	this.struct = new Struct();

	this.tags = [];
	this.length = this.struct.push("H", 0);
	this.entries = this.struct.push(new Struct());
	this.next = this.struct.push("L", 0);
	this.data = this.struct.push(new Struct());

	if (ifdData) {
		var self = this;
		ifdData.tagList.forEach(function(tag) {
			if ([0x8825, 0x8769, 0xA005, 0xEA1C].indexOf(tag.id) > -1) {
				return; //skip sub-ifd links and windows padding.
			}
			var packed = new CompiledTag(tag);
			self.tags.push(packed);
			self.entries.push(packed.struct);
		});
	}
};
CompiledIFD.prototype.compile = function() {
	/*	for tags with values of bytelength greater than 4, we must store the values in the IFD's data-area.
		this method pushes the values there, and sets the tag-pointers to point to the offset of the value.

		it is done separately from the main exif-compilation, because one might want to add more tags before
		calculating pointers to offset. If one added more data to the IFD after compiling, the pointers would
		point to the wrong offsets.
	*/
	var self = this;
	this.tags.forEach(function(tag) {
		if (tag.value.length > 4) {
			tag.pointer.set("L", 0, self.offset + self.entries.byteLength + 6 + self.data.byteLength);
			self.data.push("B", tag.value);
		}
	});
	this.length.set("H", 0, this.entries.byteLength/12);
};
var CompiledExifSegment = function(exifData) {
	/*	Compile an Exif object to an array of bytes */
	this.data = exifData;
	this.struct = new Struct();

	this.headers = this.struct.push(new Struct());
	this.headers.push("H", 0xFFE1); //APP1, JPEG marker (not a part of TIFF, and thus not included in the this.size counter)
	this.size = this.headers.push("H", 0); //total size of exif segment, including embedded thumbnail, and including the size-indicator.
	this.headers.push("B", [0x45, 0x78, 0x69, 0x66, 0, 0]); //APP1 ID header, "Exif"nullnull, identifies the APP1 segment as EXIF.
	this.tiff = this.headers.push("B", [0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8]); //TIFF header with Ascii MM (motorola) denoting big endianness

	this.IFDs = this.struct.push(this.compileIFDSegments());
	this.thumbnail = (this.data.hasOwnProperty("thumbnailData")) ? this.struct.push("B", this.data.thumbnailData) : this.struct.push(new Struct());
	this.size.set("H", 0, this.struct.byteLength - this.size.offset);
};
CompiledExifSegment.prototype.compileIFDSegments = function() {
	var output = new Struct();

	var links = {
		exif: null,
		gps: null,
		iop: null,
	};

	var ifd0 = new CompiledIFD(8, this.data.ifd0);

	//the EXIF and GPS sub-IFDs are linked to by tags stored in IFD0; add the tags here, with 0 values.
	if (this.data.hasOwnProperty("exif")) {
		ifd0.entries.push("B", [135,105, 0,4, 0,0,0,1]);
		links.exif = ifd0.entries.push("L", 0);
	}
	if (this.data.hasOwnProperty("gps")) {
		ifd0.entries.push("B", [136,37, 0,4, 0,0,0,1]);
		links.gps = ifd0.entries.push("L", 0);
	}

	ifd0.compile();
	output.push(ifd0.struct);

	//create sub-IFDs, and set the value of the tags linking to their offset.
	if (links.exif !== null) {

		var exif = new CompiledIFD(8+output.byteLength, this.data.exif);
		links.exif.set("L", 0, 8+output.byteLength);
		output.push(exif.struct);

		if (this.data.hasOwnProperty("iop")) {
			exif.entries.push("B", [160,5, 0,4, 0,0,0,1]);
			links.iop = exif.entries.push("L", 0);
		}

		exif.compile();
		output.push(exif.struct);

		if (links.iop !== null) {
			var iop = new CompiledIFD(8+output.byteLength, this.data.iop);
			links.iop.set("L", 0, 8+output.byteLength);
			iop.compile();
			output.push(iop.struct);
		}

	}

	if (links.gps !== null) {
		var gps = new CompiledIFD(8+output.byteLength, this.data.gps);
		links.gps.set("L", 0, 8+output.byteLength);
		gps.compile();
		output.push(gps.struct);
	}

	if (this.data.hasOwnProperty("ifd1")) {
		ifd0.next.set("L", 0, 8+output.byteLength);
		var ifd1 = new CompiledIFD(8+output.byteLength, this.data.ifd1);
		ifd1.compile();
		output.push(ifd1.struct);
	}

	return output;
};


export default function exifToBytes(exifData) {
	return new CompiledExifSegment(exifData).struct.array
}
