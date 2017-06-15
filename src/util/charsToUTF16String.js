module.exports = function charsToUTF16String(chars, littleEndian) {
    //combine chars to a UTF16 string [0, 0x24, 0xD8, 0x52, 0xDF, 0x62] -> "$𤭢"
    var i = 0;
    var step = 1;
    if (littleEndian) {
        i = 1;
        step = -1;
    }
    var output = "";
    for ( ; i < chars.length; i+=2) {
        var b1 = chars[i];
        var b2 = chars[i+step];
        if (b1 < 0xD8 || b1 >= 0xE0) {
            output += String.fromCharCode(b1+b2);
        }
        else {
            i+=2;
            var b3 = chars[i];
            var b4 = chars[i+step];
            output += String.fromCharCode((b1<<8)+b2, (b3<<8)+b4);
        }
    }
    return output;
}
