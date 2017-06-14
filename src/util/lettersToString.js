export default function lettersToString(letters) {
    //combine characters to a string ["E","x","i","f"] -> "Exif"

    let output = ''
    letters.forEach(character => output += character)
    return output
    
}
