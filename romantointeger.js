/**
 * @param {string} s
 * @return {number}
 */
// Step 1: create a mapping of expected roman numerals with their numbers. Include the 6 special cases of subtractive numerals (eg IV)
const table = {
    I: 1,
    IV: 4,
    V: 5,
    IX: 9,
    X: 10,
    XL: 40,
    L: 50,
    XC: 90,
    C: 100,
    CD: 400,
    D: 500,
    CM: 900,
    M: 1000
  }
  
  
  function romanToInt(roman) {
    roman.toUpperCase()
    let int = 0 // result
  
    // step 2, iterate over the input
    for (let i = 0; i < roman.length; i++) {
      let current = roman[i]
      let next = roman[i + 1]
      let pair = current + next  // eg: IV
  
      // step 3, look for the pair in the map
      if (table[pair]) {
        int += table[pair] // add the value to result
        i++ // increment i. i also gets incremented by for loop, so this adds another 1 to i because we want to skip the next element (already in pair) in roman
      } else {
        int += table[current]
      }
    }
  
    return int
  }
  
  romanToInt('CDII')