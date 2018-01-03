
export function compareArray(a1, a2) {
  // if (a1.length !== a2.length) {
  //   throw new Error(`length not equal ${a1.length} !== ${a2.length}`)
  // } else {
    for (let i = 0; i < a1.length; ++i) {
      if (a1[i] != a2[i]) {
        console.log('not equal', i, a1[i], a2[i])
      }
    }
  // }
}
