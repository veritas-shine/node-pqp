import numjs from 'numjs'
import '../utils/polyfill'

// from MDN(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export default class RandomGenerator {
  constructor() {
  }

  get_random_vector(length) {
    const array = []
    for (let _ = 0; _ < length; ++_) {
      array.push(getRandomInt(0, 2))
    }
    return numjs.array(array)
  }

  get_random_weight_vector(length, weight) {
    const random_indices = new Set()
    for (let _ = 0; _ < weight; ++_) {
      random_indices.add(getRandomInt(0, length))
    }

    while (random_indices.size < weight) {
      random_indices.add(getRandomInt(0, length))
    }

    const real = numjs.zeros([length, 1])
    random_indices.forEach(idx => real.set(idx, 0, 1))
    const images = numjs.zeros([length, 1])
    return numjs.concatenate(real, images)

  }

  flip_coin() {
    return getRandomInt(0, 2)
  }
}
