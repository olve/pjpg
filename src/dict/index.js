import {lettersToString, charsToString, charsToUTF16String} from '../util'

function getValue(tagId, dictionary, attribute) {
  if (dictionary) {
    const tag = dictionary[tagId]
    if (tag) {
      return tag[attribute]
    }
  }
}
function getStringValues(tagId, values, dictionary) {
    //get stringvalues (values legible by humans) from provided dictionary for array of tag values
    //example for values=[2] and tagId=0x9207: "Center-weighted average"
    var output = [];
    if (dictionary) {
        var stringvalues = getValue(tagId, dictionary, "stringvalues");
        if (stringvalues) {
            for (var i = 0; i < values.length; i++) {
                var val = values[i].toString();
                if (stringvalues.hasOwnProperty(val)) {
                    val = stringvalues[val];
                }
                output.push(val);
            }
        }
        else {
            output = values;
        }
        return output;
    }
}
function parseValue(tag, dictionary) {

    var value;

    if (tag.type === 2) {
        value = lettersToString(tag.value);
    }
    else if (tag.id === 0x9286 || tag.id === 0x927C) {
        //Exif.Photo.UserComment and Exif MakerNote. type 7 undefined. For writing comments with any encoding.
        value = charsToString(tag.value, tag.littleEndian);
    }
    else if ([0x9c9b, 0x9c9c, 0x9c9d, 0x9c9e, 0x9c9f].indexOf(tag.id) !== -1) {
        //Turn Windows XP tags with UCS2 character encoding into UTF-16 strings. (UCS2 is UTF-16's predecessor and is similar enough for us to read it as UTF16.)
        if (typeof tag.value[0] === "string") {
            value = lettersToString(tag.value);
        }
        else {
            value = charsToUTF16String(tag.value, tag.littleEndian)
        }
    }
    else {
        value = tag.value;
        if (dictionary) {
            value = getStringValues(tag.id, tag.value, dictionary)
        }
        if (value.length === 1) {
            value = value[0];
        }
    }
    return value;
}

export jpeg from './jpeg'
export tiff from './tiff'
export iptc from './iptc'

export default {
  getValue, getStringValues, parseValue
}