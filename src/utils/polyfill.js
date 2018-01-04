import FFT from 'fft'
import CryptoJS from 'crypto-js'

Float64Array.prototype.fft = function () {
  const n = this.length
  const fft = new FFT.complex(n, false)
  const out = new Float64Array(2 * n)
  fft.simple(out, this, 'real')
  return out
}

Float64Array.prototype.ifft = function (length) {
  const ifft = new FFT.complex(length, true)
  const out = new Float64Array(2 * length)
  ifft.simple(out, this)
  return out.map(value => value / length)
}

Float64Array.prototype.complexMultiply = function (other) {
  const length = this.length
  const result = new Float64Array(length)
  for (let idx = 0; idx < length - 1; idx = idx + 2) {
    const a = this[idx]
    const b = this[idx + 1]
    const c = other[idx]
    const d = other[idx + 1]
    result[idx] = a * c - b * d
    result[idx + 1] = a * d + b * c
  }
  if (length % 2 === 1) {
    result[length - 1] = this[length - 1] * other[length - 1]
  }
  return result
}

Float64Array.prototype.real = function () {
  return this.filter((value, idx) => idx % 2 === 0)
}

Float64Array.prototype.image = function () {
  return this.filter((value, idx) => idx % 2 === 1)
}

Float64Array.prototype.round = function () {
  return this.map(value => Math.round(value))
}

Float64Array.prototype.mod = function (mod) {
  return this.map(value => value % mod)
}

Float64Array.prototype.nonzero = function () {
  const result = []
  this.forEach((value, idx) => {
    if (value != 0) {
      result.push(idx)
    }
  })
  return result
}

Float64Array.prototype.zeros = function () {
  const result = []
  this.forEach((value, idx) => {
    if (value == 0) {
      result.push(idx)
    }
  })
  return result
}

Float64Array.prototype.multiply = function (number) {
  return this.map(value => value * number)
}

Float64Array.prototype.clone = function () {
  return Float64Array.from(this)
}

Float64Array.prototype.toArray = function () {
  return Array.from(this)
}

Float64Array.prototype.toPrintString = function () {
  let result = '['
  const count = this.length
  for (let idx = 0; idx < count; ++idx) {
    if (idx !== count - 1) {
      result += `${this[idx]}, `
    } else {
      result += `${this[idx]} `
    }
    if (idx % 25 === 0 && idx > 0) {
      result += '\n'
    }
  }
  result += ']'
  return result
}

// String

String.prototype.toWordArray = function () {
  const buffer = Buffer.from(this, 'utf8')
  const array = new Uint8Array(buffer)
  return CryptoJS.lib.WordArray.create(array)
}

String.prototype.appendWordArray = function (suffix) {
  return this.toWordArray().concat(suffix)
}
