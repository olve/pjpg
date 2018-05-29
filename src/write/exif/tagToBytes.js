var bigRat = require('big-rational')
var Struct = require('structs.js')

export default function compileExifTagValueToBytes(tag, formatCharacter) {
	/* Compiles the value of an exif tag object to an array of bytes */

	if (!tag.hasBeenChanged && !tag.littleEndian && tag.hasOwnProperty("bytes")) {
		return tag.bytes;
	}

	var output = new Struct();
	var value = tag.value;
	var components = tag.components;

	if (tag.hasBeenChanged) {
		if (tag.type === 2) {
			value = tag.value[0].split("");
		}
		else if (tag.type === 5 || tag.type === 10) {
			value = [parseFloat(tag.value[0])];
		}
		else {
			value = [parseInt(tag.value[0])];
		}
		components = value.length;
	}

	//instead of recompiling tag.value, one could use tag.bytes, which is stored when a tag is read from a file;
	//however using tag.value is more consistent, because when new values are stored, we use tag.value; not tag.bytes.
	//note that tag.bytes are stored with the endianness of the original file's exif segment.

	if (tag.type === 2) {
		//convert string to charcodes
		for (var i=0; i<components; i++) {
			output.push("B", value[i].charCodeAt(0));
		}
	}
	else if (tag.type === 5 || tag.type === 10) {
		/*	rationals are stored as two longs, numerator/denominator
			we convert rationals to a fraction with Peter Olson's BigRational lib.
			(https://github.com/peterolson/BigRational.js) */
		for (var i=0; i<components; i++) {
			var chr = (tag.type===5) ? "L" : "l";
			var component = value[i];
			var fraction = function toFraction(rational, epsilon) {
				var denominator = 0;
				var numerator,
            error;
				do {
					denominator++;
					numerator = Math.round((rational.numerator * denominator) / rational.denominator);
					error = Math.abs(rational.minus(numerator/denominator));
				} while (error > epsilon);
				return {numerator: numerator, denominator: denominator};
			}(bigRat(component), 0.0001);
			output.push(chr, fraction.numerator);
			output.push(chr, fraction.denominator);
		}
	}
	else {
		//every other type of tag.
		for (var i=0; i<components; i++) {
			output.push(formatCharacter, value[i]);
		}
	}
	return output.array;
}
