export default function lettersToString(letters) {
    //combine characters to a string ["E","x","i","f"] -> "Exif"
    var output = "";
    letters.forEach(function(character) {
        output += character;
    });
    return output;
  }
