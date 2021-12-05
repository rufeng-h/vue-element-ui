const setUtil = {
  diff (arr1, arr2) {
    const set = new Set(arr2)
    return arr1.filter(v => !set.has(v))
  },
  intersect (arr1, arr2) {
    const set = new Set(arr2)
    return arr1.filter(v => set.has(v))
  },
  union (arr1, arr2) {
    return new Set([...arr1, ...arr2])
  }
}

export {
  setUtil
}


