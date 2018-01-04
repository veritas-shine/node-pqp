import { FFT, RFFT } from './FFTW'
import CryptoJS from 'crypto-js'

Float64Array.prototype.fft = function () {
  let count = this.length
  const fft = new FFT(count)
  const transform = Float64Array.from(fft.forward(this))
  fft.dispose()
  return transform
}

const scaleTransform = function (trans, size) {
  let i = 0,
      bSi = 1.0 / size,
      x = trans;
  while (i < x.length) {
    x[i] *= bSi;
    i++;
  }
  return x;
}

Float64Array.prototype.ifft = function (length) {
  const fft = new FFT(length)
  let temp = Float64Array.from(this)
  temp = scaleTransform(temp, length)
  const transform = fft.inverse(temp.slice(0, length)).slice(0, length)
  fft.dispose()
  return transform
}

Float64Array.prototype.fftComplexMultiply = function (other) {
  let length = this.length
  // normalize to even length
  if (length % 2 === 1) {
    length += 1
  }
  // result only store the real parts of complex multiply
  const result = new Float64Array(length)
  const half = length / 2
  for (let idx = 0; idx < half; ++idx) {
    const i = 2 * idx
    const a = this[i] || 0
    const b = this[i + 1] || 0
    const c = other[i] || 0
    const d = other[i + 1] || 0
    result[idx] = a * c - b * d

    const jdx = 2 * (half - idx - 1)
    const m = this[jdx] || 0
    const n = this[jdx + 1] || 0
    const p = other[jdx] || 0
    const q = other[jdx + 1] || 0
    result[half + idx] = m * p - (-n) * (-q) // because it's conjugated
  }

  return result
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
  const count = this.length
  const result = this.filter((value, idx) => idx % 2 === 0 && idx < count - 1)
  let half = Float64Array.from(result)
  half = half.reverse().slice(0, count - result.length)

  return result.concat(half)
}

Float64Array.prototype.image = function () {
  return this.filter((value, idx) => idx % 2 === 1)
}

Float64Array.prototype.concat = function (second) {
  const firstLength = this.length
  const result = new Float64Array(firstLength + second.length)

  result.set(this)
  result.set(second, firstLength)

  return result
}

Float64Array.prototype.round = function () {
  return this.map(value => Math.round(value))
}

Float64Array.prototype.mod = function (mod) {
  return this.map(value => value % mod)
}

Float64Array.prototype.nonzero = function () {
  return this.findIndex(value => value != 0)
}

Float64Array.prototype.zeros = function () {
  return this.findIndex(value => value == 0)
}

Float64Array.prototype.multiply = function (number) {
  return this.map(value => value * number)
}

Float64Array.prototype.clone = function () {
  return Float64Array.from(this)
}

Float64Array.prototype.toArray = function () {
  return Array.prototype.slice.call(this)
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
