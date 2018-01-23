import asn from 'asn1.js'
import BitArray from 'node-bitarray'
import '../utils/polyfill'
import PrivateKey from '../crypto/private_key'
import PublicKey from '../crypto/public_key'
import {toBitArray} from './conversion'

const ASN1PublicKey = asn.define('ASN1PublicKey', function() {
  this.seq().obj(this.key('G').bitstr())
});

const ASN1PrivateKey = asn.define('ASN1PrivateKey', function () {
  this.seq().obj(
      this.key('H0').bitstr(),
      this.key('H1').bitstr(),
      this.key('H1inv').bitstr()
  )
});

const ASN1Ciphertext = asn.define('ASN1Ciphertext', function () {
  this.seq().obj(
      this.key('C0').bitstr(),
      this.key('C1').bitstr(),
      this.key('Sym').octstr()
  )
});

export default class IO {
  extract_der_priv_key(seq) {
    const der = ASN1PrivateKey.decode(seq, 'pem', {label: 'PQP PRIVATE KEY'})
    const priv_key = new PrivateKey()
    priv_key.H_0 = toBitArray(der['H0'])
    priv_key.H_1 = toBitArray(der['H1'])
    priv_key.H_1inv = toBitArray(der['H1inv'])
    priv_key.block_length = priv_key.H_0.length
    return priv_key
  }

  get_der_priv_key(priv_key) {
    const der = ASN1PrivateKey.encode({
      H0: {
        data: BitArray.toBuffer(priv_key.H_0),
        unused: 7
      },
      H1: {
        data: BitArray.toBuffer(priv_key.H_1),
        unused: 7
      },
      H1inv: {
        data: BitArray.toBuffer(priv_key.H_1inv),
        unused: 7
      }
    }, 'pem', {
      label: 'PQP PRIVATE KEY'
    });
    return der
  }

  extract_der_pub_key(seq) {
    const der = ASN1PublicKey.decode(seq, 'pem', {label: 'PQP PUBLIC KEY'})
    const pub_key = new PublicKey()
    pub_key.G = toBitArray(der['G'])
    pub_key.block_length = pub_key.G.length
    return pub_key
  }


  get_der_pub_key(pub_key) {
    return ASN1PublicKey.encode({
      G: {
        data: BitArray.toBuffer(pub_key.G),
        unused: 7
      }
    }, 'pem', {
      label: 'PQP PUBLIC KEY'
    })
  }

  get_der_ciphertext(c_0, c_1, symmetric_stream) {
    const der = ASN1Ciphertext.encode({
      C0: {
        data: BitArray.toBuffer(c_0),
        unused: 7
      },
      C1: {
        data: BitArray.toBuffer(c_1),
        unused: 7
      },
      Sym: symmetric_stream
    }, 'pem', {
      label: 'PQP MESSAGE'
    })
    return der
  }

  extract_der_ciphertext(seq) {
    const der =  ASN1Ciphertext.decode(seq, 'pem', {label: 'PQP MESSAGE'})
    const c_0 = toBitArray(der['C0'])
    const c_1 = toBitArray(der['C1'])
    const symmetric_stream = der['Sym']
    return [c_0, c_1, symmetric_stream]
  }
}
