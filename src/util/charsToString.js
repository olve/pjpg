module.exports = function charsToString(chars) {
    //combine charcodes to a string [0x41, 0x42] -> "AB"
    var output = "";
    chars.forEach(function(charCode) {
        output += String.fromCharCode(charCode);
    });
    return output;
}
