import {FFT} from 'fftw-js'
import CryptoJS from 'crypto-js'

Float32Array.prototype.fft = function () {
  const fft = new FFT(this.length)
  const transform = Float32Array.from(fft.forward(this))
  fft.dispose()
  return transform
}

const scaleTransform = function(trans, size) {
  let i = 0,
    bSi = 1.0 / size,
    x = trans;
  while(i < x.length) {
    x[i] *= bSi; i++;
  }
  return x;
}

Float32Array.prototype.ifft = function () {
  const fft = new FFT(this.length)
  let temp = Float32Array.from(this)
  temp = scaleTransform(temp, this.length)
  const transform = Float32Array.from(fft.inverse(temp))
  fft.dispose()
  return transform
}

Float32Array.prototype.complexMultiply = function (other) {
  const result = new Float32Array(this.length)
  for (let idx = 0; idx < this.length - 1; idx = idx + 2) {
    const a = this[idx]
    const b = this[idx + 1]
    const c = other[idx]
    const d = other[idx + 1]
    result[idx] = a * c - b * d
    result[idx + 1] = a * d + b * c
  }
  return result
}

Float32Array.prototype.real = function () {
  return this.filter((value, idx) => idx % 2 === 1)
}

Float32Array.prototype.round = function () {
  return this.map(Math.round)
}

Float32Array.prototype.mod = function (mod) {
  return this.map(value => value % mod)
}

Float32Array.prototype.nonzero = function () {
  return this.findIndex(value => value != 0)
}

Float32Array.prototype.zeros = function () {
  return this.findIndex(value => value == 0)
}

Float32Array.prototype.multiply = function (number) {
  return this.map(value => value * number)
}

Float32Array.prototype.clone = function () {
  return Float32Array.from(this)
}

Float32Array.prototype.toArray = function () {
  return  Array.prototype.slice.call(this)
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
