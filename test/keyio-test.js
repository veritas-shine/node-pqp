import assert from 'assert'
import IO from '../src/operations/keyio'
import fs from 'fs'
import path from 'path'
import {H0, H1, H1_inv, G, C0, C1, Sym} from './example'

describe('keyio test', function () {
  const loader = new IO();
  const cipherData = fs.readFileSync(path.resolve(__dirname, './enc.data'), 'utf8')
  const privKey = fs.readFileSync(path.resolve(__dirname, './priv.key'), 'utf8')
  const pubKey = fs.readFileSync(path.resolve(__dirname, './pub.key'), 'utf8')
  const exp = new RegExp(/\n/g)
  it('should extract_der_priv_key', function () {
    const pk = loader.extract_der_priv_key(privKey)
    assert.deepEqual(H0, pk.H_0)
    assert.deepEqual(H1, pk.H_1)
    assert.deepEqual(H1_inv, pk.H_1inv)
  })

  it('should extract pub key', function () {
    const pubk = loader.extract_der_pub_key(pubKey)
    assert.deepEqual(G, pubk.G)
  })

  it('should extract message', function () {
    const msg = loader.extract_der_ciphertext(cipherData)
    assert.deepEqual(C0, msg[0])
    assert.deepEqual(C1, msg[1])
    assert.deepEqual(Sym, new Uint8Array(msg[2]))
  })

  it('should gen private key', function () {
    const pk = loader.extract_der_priv_key(privKey)
    const str = loader.get_der_priv_key(pk)
    assert.equal(str.replace(exp, ''), privKey.replace(exp, ''))
  })

  it('should gen public key', function () {
    const pubk = loader.extract_der_pub_key(pubKey)
    const ps = loader.get_der_pub_key(pubk)
    assert.equal(ps.replace(exp, ''), pubKey.replace(exp, ''))
  })

  it('should gen cipher text', function () {
    const msg = loader.extract_der_ciphertext(cipherData)
    const c1 = loader.get_der_ciphertext(C0, C1, Sym)
    const c2 = loader.get_der_ciphertext(msg[0], msg[1], msg[2])
    assert.equal(c1.replace(exp, ''), c2.replace(exp, ''))
  });
})
