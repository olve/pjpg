export default function readGeneric(offset, buffer) {
  //read generic jpeg segment
  const view = new DataView(buffer)
  const array = new Uint8Array(buffer)

  const length = view.getUint16(offset + 2)
  const end = length + offset + 2

  return Array.from(array).slice(offset, end)
}
