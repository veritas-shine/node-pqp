import nj from 'numjs'
import CryptoJS from 'crypto-js'

nj.NdArray.prototype.nonzero = function() {
  const result = []
  this.forEach((val, i) => {
    if (val != 0) {
      result.push(i)
    }
  })
  return nj.array(result)
}

nj.NdArray.prototype.forEach = function (looper) {
  if (typeof looper === 'function') {
    const size = this.size
    for (let i = 0; i < size; ++i) {
      looper(this.get(i), i)
    }
  }
}

nj.NdArray.prototype.filter = function (looper) {
  const result = []
  if (typeof looper === 'function') {
    this.forEach((val, idx) => {
      if (looper(val, idx)) {
        result.push(val)
      }
    })
  }
  return result
}

nj.NdArray.prototype.map = function (looper) {
  const result = []
  if (typeof looper === 'function') {
    this.forEach((val, idx) => {
      result.push(looper(val, idx))
    })
  }
  return result
}

nj.NdArray.prototype.mod = function (num) {
  this.forEach((val, idx) => this.set(idx, val % num))
  return this
}

nj.NdArray.prototype.count = function () {
  const shape = this.shape
  return shape[0]
}

nj.NdArray.prototype.extend = function () {
  const shape = this.shape
  if (shape.length === 1) {
    // 1-dim, need to extend
    const copy = nj.zeros([shape[0], 2])
    this.forEach((val, idx) => copy.set(idx, 0, val))
    return copy
  }
  return this
}

nj.NdArray.prototype.shim = function () {
  const shape = this.shape
  if (shape.length === 2 && shape[1] === 2) {
    // 2-dim, need to shim
    const count = shape[0]
    const copy = nj.zeros(count)
    for (let idx = 0; idx < count; ++idx) {
      copy.set(idx, this.get(idx, 0))
    }
    return copy
  }
  return this
}

nj.NdArray.prototype.real = nj.NdArray.prototype.shim

nj.NdArray.prototype.addAt = function (idx, delta) {
  this.opAt(idx, '+', delta)
}

nj.NdArray.prototype.opAt = function (idx, op, delta) {
  const current = this.get(idx)
  switch (op) {
    case '+': {
      this.set(idx, current + delta)
      break
    }
    case '-': {
      this.set(idx, current - delta)
      break
    }
    case '*': {
      this.set(idx, current * delta)
      break
    }
    case '/': {
      this.set(idx, current / delta)
      break
    }
    case '^': {
      this.set(idx, current ^ delta)
      break
    }
    default: {
      break
    }
  }
}

nj.NdArray.prototype.complexMultiply = function (other) {
  const count = this.count()
  const result = nj.zeros([count, 2])
  for (let i = 0; i < count; ++i) {
    const a = this.get(i, 0)
    const b = this.get(i, 1)
    const c = other.get(i, 0)
    const d = other.get(i, 1)
    result.set(i, 0, a*c - b*d)
    result.set(i, 1, a*d + b*c)
  }
  return result
}

nj.NdArray.prototype.fft = function () {
  const shape = this.shape
  if (shape.length === 2 && shape[1] === 2) {
    //
    return nj.fft(this)
  } else {
    return nj.fft(this.extend())
  }
}

nj.NdArray.prototype.ifft = function () {
  const shape = this.shape
  if (shape.length === 2 && shape[1] === 2) {
    //
    return nj.ifft(this)
  } else {
    return nj.ifft(this.extend())
  }
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
