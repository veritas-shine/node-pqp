import nj from 'numjs'
import '../utils/polyfill'
nj.config.printThreshold = 9000;

export function mul_poly(x, y) {
  x = x.fft()
  y = y.fft()
  let temp = x.complexMultiply(y).ifft().real()
  temp = nj.round(temp)
  temp = temp.mod(2)
  return temp
}

export function square_sparse_poly(x, times=1) {
  let indices = x.nonzero()
  const mod = x.count()
  const result = nj.zeros([mod])
  indices = indices.multiply(Math.pow(2, times) % mod)
  indices.forEach(index => {
    const idx = index % mod
    result.opAt(idx, '^', 1)
  })
  return result
}

export function exp_poly(x, n) {
  let y = nj.zeros([x.count(), 2])
  y.set(0, 0, 1)

  while (n.gt(1)) {
    if (n.mod(2) == 0) {
      x = square_sparse_poly(x)
      n = n.div(2)
    } else {
      // precision does not allow us to stay in FFT domain
      // hence, interchanging ifft(fft).
      const X = x.clone().fft()
      const Y = y.clone().fft()

      let temp = X.complexMultiply(Y).ifft().real()
      y = nj.round(temp).mod(2)
      x = square_sparse_poly(x)
      n = n.sub(1)
      n = n.div(2)
    }
  }

  return nj.round(mul_poly(x, y).shim()).mod(2)
}
