export default function charsToString(chars) {
    //combine charcodes to a string [0x41, 0x42] -> "AB"
    let output = ''
    chars.forEach(charCode => output += String.fromCharCode(charCode))
    return output
}
