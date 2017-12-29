import Config from '../utils/config'
const {private_key} = Config

export default class PrivateKey {
  constructor() {
    this.block_length = private_key.length // this is insecure, but OK for tests
    this.block_weight = private_key.weight
    this.block_error = private_key.error

    this.H_0 = []
    this.H_1 = []
    this.H_1inv = []
  }
}
