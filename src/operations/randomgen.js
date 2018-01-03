
// from MDN(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// fill array of `size` with `0`
export function zeroArray(size) {
  const result = new Float64Array(size)
  result.fill(0)
  return result
}

export default class RandomGenerator {
  get_random_vector(size) {
    const result = new Float32Array(size)
    for (let i = 0; i < size; i++)
      result[i] = getRandomInt(0, 2)
    return result
  }

  get_random_weight_vector(length, weight) {
    const random_indices = new Set()
    for (let _ = 0; _ < weight; ++_) {
      random_indices.add(getRandomInt(0, length))
    }

    while (random_indices.size < weight) {
      random_indices.add(getRandomInt(0, length))
    }

    const real = zeroArray(length)
    random_indices.forEach(idx => real[idx] = 1)
    return real
  }

  flip_coin() {
    return getRandomInt(0, 2)
  }
}
