import Keygen from '../src/crypto/keygen'

import { mul_poly } from '../src/operations/arithmetic'
import {H1, H1_inv} from './example'

const h1 = Float32Array.from(H1)
const re = mul_poly(h1, Float32Array.from(H1_inv))
console.log(re)

const gen = new Keygen()
const pair = gen.generate()
console.log(pair)
