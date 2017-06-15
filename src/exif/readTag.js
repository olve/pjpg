export default function readTag(id, offset, tiff, view, littleEndian) {

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
