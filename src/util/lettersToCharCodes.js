export default function lettersToCharCodes(letters) {
    //return letters as charcodes ["A", "B"] -> [0x41, 0x42]
    var output = [];
    letters.forEach(function(letter) {
        output.push(letter.charCodeAt(0));
    });
    return output;
}
