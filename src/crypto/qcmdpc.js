import nj from 'numjs'
import PublicKey from './publick_key'
import RandomGenerator from '../operations/randomgen'
import {mul_poly} from '../operations/arithmetic'

export default class McEliece {
  constructor() {
    this.randgen = new RandomGenerator()
  }

  set_private_key(priv_key) {
    this.H_0 = priv_key.H_0
    this.H_1 = priv_key.H_1
    this.G = mul_poly(priv_key.H_0, priv_key.H_1inv) // compute public key

    this.block_length = priv_key.block_length
    this.block_error = priv_key.block_error
    this.block_weight = priv_key.block_weight
  }

  get_public_key() {
    const pub_key = new PublicKey()
    pub_key.G = this.G
    pub_key.block_error = this.block_error
    return pub_key

  }

  encrypt(pub_key, m) {
// non-constant weight to achieve cipertext indistinguishability
    const temp = mul_poly(pub_key.G, m.clone())
    let t = this.randgen.get_random_weight_vector(pub_key.block_length, pub_key.block_error + this.randgen.flip_coin())
    const v = temp.add(t.shim()).mod(2)
    t = this.randgen.get_random_weight_vector(pub_key.block_length, pub_key.block_error + this.randgen.flip_coin())
    const u = m.add(t.shim()).mod(2)
    return [u, v]
  }

  syndrome(c_0, c_1) {
    return mul_poly(this.H_0, c_0).add(mul_poly(this.H_1, c_1)).mod(2)
  }

  decrypt(c_0, c_1) {
    const synd = this.syndrome(c_0, c_1)
    // compute correlations with syndrome
    const H0_ind = this.H_0.nonzero()
    const H1_ind = this.H_1.nonzero()

    const kBL = this.block_length
    const unsat_H0 = nj.zeros([kBL])
    H0_ind.forEach(i => {
      for (let j = 0; j < synd.count(); ++ j) {
        if (synd.get(j)) {
          const idx = (j + kBL - i) % kBL
          unsat_H0.addAt(idx, 1)
        }
      }
    })

    const unsat_H1 = nj.zeros([kBL])
    H1_ind.forEach(i => {
      for (let j = 0; j < synd.count(); ++ j) {
        if (synd.get(j)) {
          const idx = (j + kBL - i) % kBL
          unsat_H1.addAt(idx, 1)
        }
      }
    })

    const rounds = 10
    const delta = 5
    let threshold = 100
    let r = 0

    while (true) {
      const max_unsat = Math.max(unsat_H0.max(), unsat_H1.max())

      // if so, we are done decoding
      if (max_unsat == 0) {
        break
      }

      // we have reach the upper bound on rounds
      if (r >= rounds) {
        throw new Error('Decryption error')
        break
      }
      r += 1

      // update threshold
      if (max_unsat > delta) {
        threshold = max_unsat - delta
      }
      const round_unsat_H0 = unsat_H0.clone()
      const round_unsat_H1 = unsat_H1.clone()

      // first block sweep
      for (let i = 0; i < kBL; ++i) {
        if (round_unsat_H0.get(i) <= threshold) {
          continue
        }

        H0_ind.forEach(j => {
          const increase = (synd.get((i + j) % kBL) == 0)

          H0_ind.forEach(k => {
            const m = (i + j - k + kBL) % kBL
            if (increase)
              unsat_H0.addAt(m, 1)
            else
              unsat_H0.addAt(m, -1)
          })

          H1_ind.forEach(k => {
            const m = (i + j - k + kBL) % kBL
            if (increase)
              unsat_H1.addAt(m, 1)
            else
              unsat_H1.addAt(m, -1)

          })

          synd.opAt((i + j) % kBL, '^', 1)
        })

        c_0.opAt(i, '^', 1)
      }

      // second block sweep
      for(let i = 0; i < kBL; ++i) {
        if (round_unsat_H1.get(i) <= threshold) {
          continue
        }

        H1_ind.forEach(j => {
          const increase = (synd.get((i + j) % kBL) == 0)

          H0_ind.forEach(k => {
            const m = (i + j - k + kBL) % kBL
            if (increase)
              unsat_H0.addAt(m, 1)
            else
              unsat_H0.addAt(m, -1)
          })

          H1_ind.forEach(k => {
            const m = (i + j - k + kBL) % kBL
            if(increase)
              unsat_H1.addAt(m, 1)
            else
              unsat_H1.addAt(m, -1)
          })
          synd.opAt((i + j) % kBL, '^', 1)
        })

        c_1.opAt(i, '^', 1)
      }
    }
    return c_0
  }
}

