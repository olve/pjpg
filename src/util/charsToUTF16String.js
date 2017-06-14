export default function charsToUTF16String(chars, littleEndian) {
  /* combine chars to a UTF16 string [0, 0x24, 0xD8, 0x52, 0xDF, 0x62] -> "$𤭢"

    args:
      chars: array of bytes,
      littleEndian: read as little endian? (bool)
  */

  let i = littleEndian ? 1 : 0
  let step = littleEndian ? -1 : 1

  let output = ''

  for (; i < chars.length; i +=2 ) {
    const b1 = chars[i]
    const b2 = chars[i+step]

    if (b1 < 0xD8 || b1 >= 0xE0) {
      output += String.fromCharCode(b1+b2)
    }
    else {
      i+=2
      const b3 = chars[i]
      const b4 = chars[i + step]
      output += String.fromCharCode((b1 << 8 ) + b2, (b3 << 8) + b4)
    }
  }
  return output

}
