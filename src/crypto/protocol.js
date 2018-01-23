import CryptoJS from 'crypto-js'
import Keygen from './keygen'
import McEliece from './qcmdpc'
import RandomGenerator from '../operations/randomgen'
import IO from '../operations/keyio'
import {pack} from '../operations/conversion'
const {Pkcs7} = CryptoJS.pad
import Base64 from 'crypto-js/enc-base64'
const {AES} = CryptoJS
import aesjs from 'aes-js'

function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
    c = array[i++];
    switch(c >> 4)
    {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
      // 0xxxxxxx
      out += String.fromCharCode(c);
      break;
      case 12: case 13:
      // 110x xxxx   10xx xxxx
      char2 = array[i++];
      out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
      break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
        break;
    }
  }

  return out;
}

// WordArray
function sliceWordArray(array, start, end) {
  return CryptoJS.enc.Hex.parse(array.toString(CryptoJS.enc.Hex).substr(start, end * 2))
}

export default class Protocol {
  constructor() {
    // instantiate primitives
    this.asymmetric_cipher = new McEliece()
    this.randgen = new RandomGenerator()
    this.io = new IO()

    // just some random salts
    this.saltA = 'this is just a salt'
    this.saltB = 'this is another a salt'
    this.ivSalt = 'third salt'
  }

  generate_keypair() {
// instantiate keygenerator and set keypair
    const keygen = new Keygen()
    const [privateKey, publicKey] = keygen.generate()
    this.priv_key = privateKey
    this.pub_key = publicKey
    this.asymmetric_cipher.set_private_key(this.priv_key)
  }

  set_private_key(key) {
    key = this.io.extract_der_priv_key(key)
    this.priv_key = key
    this.asymmetric_cipher.set_private_key(key)

  }

  set_public_key(key) {
    key = this.io.extract_der_pub_key(key)
    this.pub_key = key
  }

  get_private_key() {
    return this.io.get_der_priv_key(this.priv_key)
  }
  get_public_key() {
    return this.io.get_der_pub_key(this.pub_key)
  }
  generate_mac(message, token, key) {
    const word = message.appendWordArray(token).concat(key)
    return CryptoJS.SHA256(word)
  }
  symmetric_cipher_enc(message, mac, key, iv) {
    const array = message.appendWordArray(mac)
    let plain = aesjs.utils.hex.toBytes(array.toString(CryptoJS.enc.Hex))

    plain = aesjs.padding.pkcs7.pad(plain)
    key = aesjs.utils.hex.toBytes(key.toString())
    iv = aesjs.utils.hex.toBytes(iv.toString())
    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const data = aesCbc.encrypt(plain);

    return Buffer.from(data)
  }
  symmetric_cipher_dec(ciphertext, key, iv) {
    const encryptedBytes = aesjs.utils.hex.toBytes(ciphertext.toString())
    key = aesjs.utils.hex.toBytes(key.toString())
    iv = aesjs.utils.hex.toBytes(iv.toString())
    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)
    let decrypted = aesCbc.decrypt(encryptedBytes)
    decrypted = aesjs.padding.pkcs7.strip(decrypted)

    const length = 32
    const len = decrypted.length
    const mac = new Buffer(decrypted.slice(len - length, len)).toString('hex')
    let message = decrypted.slice(0, len - length)
    message = Utf8ArrayToStr(message)
    return [message, mac]
  }

  encrypt_message(message, recv_pub_key) {
// generate random data
    const randomized = this.randgen.get_random_vector(this.pub_key.block_length)
    const token = pack(randomized)

    // derive keys
    const keyA = CryptoJS.SHA256(this.append(token, this.saltA)) // just some conversion
    const keyB = CryptoJS.SHA256(this.append(token, this.saltB))

    // derive iv
    let iv = CryptoJS.SHA512(this.append(token, this.ivSalt))

    iv = sliceWordArray(iv, 0, 16)
// generate mac
    const mac = this.generate_mac(message, token, keyB)
    const [c_0, c_1] = this.asymmetric_cipher.encrypt(recv_pub_key, randomized)

    // generate ciphertext
    return this.io.get_der_ciphertext(c_0(), c_1(), this.symmetric_cipher_enc(message, mac, keyA, iv))
  }

  append(digest, suffix) {
    const array = digest.clone()
    return array.concat(suffix.toWordArray())
  }

  decrypt_message(ciphertext) {
// extract ciphertext data from DER
    const [rc_0, rc_1, symmetric_stream] = this.io.extract_der_ciphertext(ciphertext)

// decrypt necessary data
    const decrypted_token = pack(this.asymmetric_cipher.decrypt(rc_0, rc_1))

// derive keys from data
    const decrypted_keyA = CryptoJS.SHA256(this.append(decrypted_token, this.saltA)) // just some conversion
    const decrypted_keyB = CryptoJS.SHA256(this.append(decrypted_token, this.saltB))

// derive iv
    let digest = CryptoJS.SHA512(this.append(decrypted_token, this.ivSalt))
    const decrypted_iv = sliceWordArray(digest, 0, 16)

  // decrypt ciphertext and derive mac
    const stream = CryptoJS.lib.WordArray.create(new Uint8Array(symmetric_stream))
    const [decrypted_message, decrypted_mac] = this.symmetric_cipher_dec(stream, decrypted_keyA, decrypted_iv)

    const receiver_mac = this.generate_mac(decrypted_message, decrypted_token, decrypted_keyB)
    return [decrypted_message, receiver_mac.toString(CryptoJS.enc.Hex) == decrypted_mac]
  }
}

