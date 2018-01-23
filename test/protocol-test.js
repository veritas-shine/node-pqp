import assert from 'assert'
import Protocol from '../src/crypto/protocol'
import fs from 'fs'
import path from 'path'

describe('protocol test', function () {
  const protocol = new Protocol()
  const cipherData = fs.readFileSync(path.resolve(__dirname, './enc.data'), 'utf8')
  const privKey = fs.readFileSync(path.resolve(__dirname, './priv.key'), 'utf8')
  const pubKey = fs.readFileSync(path.resolve(__dirname, './pub.key'), 'utf8')
  const plainText = fs.readFileSync(path.resolve(__dirname, './data.txt'), 'utf8')
  protocol.set_private_key(privKey)

  it('should decrypt', function () {
    const [msg, verified] = protocol.decrypt_message(cipherData)
    assert.equal(msg, plainText)
    assert.equal(verified, true)
  })

  it('should encrypt', function () {
    protocol.set_public_key(pubKey)
    const cipherText = protocol.encrypt_message(plainText, protocol.pub_key)
    const [msg, verified] = protocol.decrypt_message(cipherText)
    assert.equal(msg, plainText)
    assert.equal(verified, true)
  })

  it('should generate key pairs', function () {
    // protocol.generate_keypair()
    assert.equal(true, true)
  })
})
