import aesjs from 'aes-js'

describe('aes test', function () {
  it('should aes decrypt ', function () {
// An example 128-bit key
    var key = aesjs.utils.hex.toBytes('f77e9e8b2f3aadfe31af679b8e675e13f195b0257e79737fed36dc2d18982a0f');

// The initialization vector (must be 16 bytes)
    var iv = aesjs.utils.hex.toBytes('2d5df3858cbb1b909de5bbf2a3787c43');

// When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes('5eca494f5ab1f3d48e1a37cd3277c6922f476e507ccca2680868944a7331701f91d84e0a628b5192e79db1182899736d');

// The cipher-block chaining mode of operation maintains internal
// state, so to decrypt a new instance must be instantiated.
    var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    var decryptedBytes = aesCbc.decrypt(encryptedBytes);

// Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  });
})
