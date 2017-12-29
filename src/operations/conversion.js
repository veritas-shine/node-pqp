import CryptoJS from 'crypto-js'
import BitArray from 'node-bitarray'
import nj from 'numjs'
// just some packing operation
export function pack(vec) {
  const data = vec.join('')
  return CryptoJS.SHA512(data)
}

export function toBitArray(part) {
  const {data, unused} = part
  const bits = BitArray.fromBuffer(data)
  const array = bits.toJSON()
  return nj.array(array.slice(0, array.length - unused))
}
