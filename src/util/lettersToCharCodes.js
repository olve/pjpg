export default function lettersToCharCodes(letters) {
    //return letters as charcodes ["A", "B"] -> [0x41, 0x42]
    const output = []
    letters.forEach(letter => output.push(letter.charCodeAt(0)))
    return output
}
