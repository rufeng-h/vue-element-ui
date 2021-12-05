const [arr1, arr2] = [[1, 2, 3], [2, 3, 4,]]
const [set1, set2] = [new Set(arr1), new Set(arr2)]
const arr3 = arr1.filter(v => !set2.has(v))
const arr4 = arr2.filter(v => !set1.has(v))
console.log(arr3)
console.log(arr4)
