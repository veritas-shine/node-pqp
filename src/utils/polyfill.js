import { FFT, RFFT } from 'fftw-js'
import CryptoJS from 'crypto-js'

Float32Array.createZero = function (count) {
  const array = new Float32Array(count)
  array.fill(0)
  return array
}

Float32Array.prototype.add = function (y) {
  this.forEach((value, index) => this[index] += y[index])
  return this
}

Float32Array.prototype.max = function () {
  let max = this[0]
  this.forEach(value => {
    if (value > max) {
      max = value
    }
  })
  return max
}

Float32Array.prototype.fft = function () {
  let count = this.length
  const fft = new FFT(count)
  const transform = Float32Array.from(fft.forward(this))
  fft.dispose()
  return transform
}

function scale(array, scale) {
  array.forEach((value, index) => array[index] *= scale)
}

Float32Array.prototype.ifft = function () {
  const length = this.length
  const realLength = length - 2
  const fft = new FFT(realLength)
  let temp = Float32Array.from(this)
  scale(temp, 1.0 / realLength)
  const transform = fft.inverse(temp).slice(0, realLength)
  fft.dispose()
  return transform
}

Float32Array.prototype.complexMultiply = function (other) {
  const length = this.length
  const result = new Float32Array(length)
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

Float32Array.prototype.real = function () {
  const count = this.length
  const result = this.filter((value, idx) => idx % 2 === 0 && idx < count - 1)
  let half = Float32Array.from(result)
  half = half.reverse().slice(0, count - result.length)

  return result.concat(half)
}

Float32Array.prototype.image = function () {
  return this.filter((value, idx) => idx % 2 === 1)
}

Float32Array.prototype.concat = function (second) {
  const firstLength = this.length
  const result = new Float32Array(firstLength + second.length)

  result.set(this)
  result.set(second, firstLength)

  return result
}

Float32Array.prototype.round = function () {
  return this.map(value => Math.round(value))
}

Float32Array.prototype.mod = function (mod) {
  return this.map(value => value % mod)
}

Float32Array.prototype.nonzero = function () {
  let indices = []
  this.forEach((value, index) => {
    if (value != 0) {
      indices.push(index)
    }
  })
  return Float32Array.from(indices)
}

Float32Array.prototype.multiply = function (number) {
  return this.map(value => value * number)
}

Float32Array.prototype.clone = function () {
  return Float32Array.from(this)
}

Float32Array.prototype.toArray = function () {
  return Array.prototype.slice.call(this)
}

Float32Array.prototype.toPrintString = function () {
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
