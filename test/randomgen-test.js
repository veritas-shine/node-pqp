import assert from 'assert'
import Rand from '../src/operations/randomgen'

describe('rand test', function () {
  const rand = new Rand();
  it('should random vector', function () {
    const vec = rand.get_random_vector(1)
    assert.equal(vec.length, 1)
  })

  it('should flip coin', function () {
    for (let i = 0; i < 100; ++i) {
      // console.log(rand.flip_coin())
    }
  });

  it('should get weight vector', function () {
    const vec = rand.get_random_weight_vector(10, 3)
    assert.equal(vec.length, 10)
  });
})
