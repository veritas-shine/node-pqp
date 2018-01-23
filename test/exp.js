import config from '../src/utils/config'
import Rand from '../src/operations/randomgen'
import BigNumber from 'bignum'
import { exp_poly, mul_poly } from '../src/operations/arithmetic'
import {H1, H1_inv} from './example'

const h1 = Float32Array.from(H1) // rand.get_random_weight_vector(config.private_key.length, config.private_key.weight)
// const H_1inv = exp_poly(h1, BigNumber(2).pow(1200).sub(2))
// const identityMatrix = mul_poly(h1, H_1inv)
// console.log(identityMatrix)

const re = mul_poly(h1, Float32Array.from(H1_inv))
console.log(re)
