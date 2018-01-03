import assert from 'assert'
import '../src/utils/polyfill'
import { H0, C0, kC0FFT_Real, H0FFT_Real, kH0C0Multiply } from './example'
import { compareArray } from './helper'

describe('polyfill test', function () {
  it('should compute fft 1', function () {
    const array = Float64Array.from(H0).fft()
    const real = array.real().round()
    assert.deepEqual(real, H0FFT_Real)
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

  it('should compute complex-multiply 2', function () {
    let a =Float64Array.from(H0)
    let b =Float64Array.from(C0)
    a = a.fft()
    b = b.fft()
    const result = a.complexMultiply(b).real().round()
    assert.deepEqual(result.slice(0, kH0C0Multiply.length).toArray(), kH0C0Multiply)
  })

  it('should compute inverse fft', function () {

  })
})
