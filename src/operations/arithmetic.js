
import '../utils/polyfill'
import {zeroArray} from './randomgen'

export function mul_poly(x, y) {
  x = x.fft()
  y = y.fft()
  const temp = x.complexMultiply(y).ifft().round()
  return temp
}

export function square_sparse_poly(x, times=1) {
  let indices = Float32Array.from(x.nonzero())
  const mod = x.length
  const result = zeroArray(mod)
  indices = indices.multiply(Math.pow(2, times) % mod)
  indices.forEach(index => {
    const idx = index % mod
    result[idx] = result[idx] ^ 1
  })
  return result
}

export function exp_poly(x, n) {
  let y = zeroArray(x.length)
  y[0] = 1

  while (n.gt(1)) {
    if (n.mod(2) == 0) {
      x = square_sparse_poly(x)
      n = n.div(2)
    } else {
      // precision does not allow us to stay in FFT domain
      // hence, interchanging ifft(fft).
      const X = x.clone().fft()
      const Y = y.clone().fft()

      let temp = X.complexMultiply(Y).ifft()
      y = temp.round().mod(2)
      x = square_sparse_poly(x)
      n = n.sub(1)
      n = n.div(2)
    }
  }

  return mul_poly(x, y).round().mod(2)
}
