import PrivateKey from './private_key'
import PublicKey from './public_key'
import RandomGenerator from '../operations/randomgen'
import {exp_poly, mul_poly} from '../operations/arithmetic'
import Config from '../utils/config'
import BigNumber from 'bignum'
const {private_key} = Config

export default class Keygen {
  constructor() {
    this.block_length = private_key.length
    this.block_weight = private_key.weight
    this.block_error = private_key.error

    this.rate = [1, 2]
    this.randgen = new RandomGenerator()
  }

  generate() {
    // create keypair
    const priv_key = new PrivateKey()
    const pub_key = new PublicKey()

    // set private-key parameters
    priv_key.H_0 = this.randgen.get_random_weight_vector(this.block_length, this.block_weight)
    const h1 = this.randgen.get_random_weight_vector(this.block_length, this.block_weight)
    priv_key.H_1inv = exp_poly(h1, BigNumber(2).pow(1200).sub(2))
    priv_key.H_1 = h1

    priv_key.block_length = this.block_length
    priv_key.block_weight = this.block_weight
    priv_key.block_error = this.block_error

    // set public-key parameters
    pub_key.G = mul_poly(priv_key.H_0, priv_key.H_1inv)

    pub_key.block_length = this.block_length
    pub_key.block_weight = this.block_weight
    pub_key.block_error = this.block_error

    return [priv_key, pub_key]
  }
}
