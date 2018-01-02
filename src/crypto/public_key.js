import Config from '../utils/config'
const {public_key} = Config

export default class PublicKey {
  constructor() {
    this.block_length = public_key.length // this is insecure, but OK for tests
    this.block_weight = public_key.weight
    this.block_error = public_key.error

    this.G = []
  }
}
