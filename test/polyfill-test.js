import assert from 'assert'
import '../src/utils/polyfill'
import { H0, C0, kC0FFT_Real, H0FFT_Real, kH0C0Multiply } from './example'
import { compareArray } from './helper'

describe('polyfill test', function () {
  it('should compute fft 1', function () {
    const array = Float32Array.from(H0).fft()
    const real = array.real().round()
    assert.deepEqual(real.toArray().slice(0, H0FFT_Real.length), H0FFT_Real)
  })

  it('should compute fft 2', function () {
    const array = Float32Array.from(C0).fft()
    const real = array.real().round()
    assert.deepEqual(real.slice(0, kC0FFT_Real.length).toArray(), kC0FFT_Real)
  })

  it('should compute complex multiply with even length', function () {
    let a = Float32Array.from([1, 1])
    let b = Float32Array.from([1, 2])
    const result = a.complexMultiply(b)
    assert.deepEqual(result.toArray(), [-1, 3])
  })

  it('should compute complex multiply with odd length', function () {
    const a = Float32Array.from([1, 1, 1])
    const b = Float32Array.from([1, 2, 3])
    const result = a.complexMultiply(b)
    assert.deepEqual(result.toArray(), [-1, 3, 3])
  })

  it('should compute complex multiply special for fftw 1', function () {
    const a = Float32Array.from([1, 1, 1])
    const b = Float32Array.from([1, 2, 3])
    const result = a.fftComplexMultiply(b)
    assert.deepEqual(result.toArray(), [-1, 3, 3, -1])
  })

  it('should compute complex multiply special for fftw 2', function () {
    const a = Float32Array.from([1, 1, 1, 1, 1])
    const b = Float32Array.from([1, 2, 3, 4, 5])
    const result = a.fftComplexMultiply(b)
    assert.deepEqual(result.toArray(), [-1, -1, 5, 5, -1, -1])
  })

  it('should compute complex-multiply 2', function () {
    let a = Float32Array.from(H0)
    let b = Float32Array.from(C0)
    a = a.fft()
    b = b.fft()
    const result = a.complexMultiply(b).real().round()
    assert.deepEqual(result.slice(0, kH0C0Multiply.length).toArray(), kH0C0Multiply)
  })

  it('should compute inverse fft', function () {

  })
})
