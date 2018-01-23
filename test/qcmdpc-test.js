import assert from 'assert'
import McEliece from '../src/crypto/qcmdpc'
import IO from '../src/operations/keyio'
import fs from 'fs'
import path from 'path'
import Base64 from 'crypto-js/enc-base64'
import {syndrome, kQCMDPCDecrypt} from './example'
import {pack} from '../src/operations/conversion'

describe('qcmdpc test', function () {
  const cipher = new McEliece()
  const loader = new IO()
  const cipherData = fs.readFileSync(path.resolve(__dirname, './enc.data'), 'utf8')
  const privKey = fs.readFileSync(path.resolve(__dirname, './priv.key'), 'utf8')
  const pubKey = fs.readFileSync(path.resolve(__dirname, './pub.key'), 'utf8')
  const plainText = fs.readFileSync(path.resolve(__dirname, './data.txt'), 'utf8')

  const pk = loader.extract_der_priv_key(privKey)
  cipher.set_private_key(pk)
  const [rc_0, rc_1, symmetric_stream] = loader.extract_der_ciphertext(cipherData)

  it('should syndrome', function () {
    const result = cipher.syndrome(rc_0, rc_1)
    const list = result
    assert.deepEqual(syndrome, list)
  })

  it('should decrypt', function () {
    const result = cipher.decrypt(rc_0, rc_1)
    assert.deepEqual(kQCMDPCDecrypt, result)
  })

  it('should pack decrypted token', function () {
    const result = cipher.decrypt(rc_0, rc_1).pack()
    const kToken = '7sf1p5sbQip8MuDkvsxQf2afiAqGO7txt+fQgUNU7KseNkRRxH2Rzz3ykuTGSbXN5okK9TBJ0edc+CZyAR8kmQ=='
    assert.equal(kToken, Base64.stringify(result))
  })
})
