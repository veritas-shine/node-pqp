import assert from 'assert'
import {expect} from 'chai'
import '../src/utils/polyfill'
import { H0, C0, kC0FFT_Real, H0FFT_Real, kH0C0Multiply, kMulPolyOrigin, kH0C0MultiplyReal } from './example'
import { compareArray } from './helper'
import { mul_poly } from '../src/operations/arithmetic'

describe('polyfill test', function () {
  it('should compute fft 1', function () {
    const array = Float64Array.from(H0).fft()
    const real = array.real().round()
    assert.deepEqual(real.toArray().slice(0, H0FFT_Real.length), H0FFT_Real)
  })

  it('should compute fft 2', function () {
    const array = Float64Array.from(C0).fft()
    const real = array.real().round()
    assert.deepEqual(real.slice(0, kC0FFT_Real.length).toArray(), kC0FFT_Real)
  })

  it('should compute complex multiply with even length', function () {
    let a = Float64Array.from([1, 1])
    let b = Float64Array.from([1, 2])
    const result = a.complexMultiply(b)
    assert.deepEqual(result.toArray(), [-1, 3])
  })

  it('should compute complex multiply with odd length', function () {
    const a = Float64Array.from([1, 1, 1])
    const b = Float64Array.from([1, 2, 3])
    const result = a.complexMultiply(b)
    assert.deepEqual(result.toArray(), [-1, 3, 3])
  })

  it('should compute complex multiply special for fftw 1', function () {
    const a = Float64Array.from([1, 1, 1])
    const b = Float64Array.from([1, 2, 3])
    const result = a.fftComplexMultiply(b)
    assert.deepEqual(result.toArray(), [-1, 3, 3, -1])
  })

  it('should compute complex multiply special for fftw 2', function () {
    const a = Float64Array.from([1, 1, 1, 1, 1])
    const b = Float64Array.from([1, 2, 3, 4, 5])
    const result = a.fftComplexMultiply(b)
    assert.deepEqual(result.toArray(), [-1, -1, 5, 5, -1, -1])
  })

  it('should compute complex-multiply 2', function () {
    let a = Float64Array.from(H0)
    let b = Float64Array.from(C0)
    a = a.fft()
    b = b.fft()
    const temp = a.complexMultiply(b).real()
    const result = temp.round()
    assert.deepEqual(result.slice(0, kH0C0Multiply.length).toArray(), kH0C0Multiply)
    for (let i = 0; i < kH0C0MultiplyReal.length; ++i) {
      expect(temp[i]).to.be.closeTo(kH0C0MultiplyReal[i], 0.0000005)
    }
  })

  it('should compute inverse fft', function () {
    const a = Float64Array.from([1, 1, 1, 1, 1])
    const b = a.fft()
    const d = b.complexMultiply(b)
    const c = b.ifft(a.length)
    assert.deepEqual(b.toArray().slice(0, a.length), [5, 0, 0, 0, 0])
    assert.deepEqual(c.slice(0, a.length), a)
    const e = d.ifft(a.length)
    assert.deepEqual(e, Float64Array.from([5, 5, 5, 5, 5]))
  })

  it('should compute mul_poly', function () {
  })
})
