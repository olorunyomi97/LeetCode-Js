/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    let storageObj = {}
    let most_frequent = 0
    let maxElement = null
    
    for (let num of nums) {
        storageObj[num] = storageObj[num] + 1 ||1;
    }
    
    for (num in storageObj) {
        if (storageObj[num] > most_frequent){
            most_frequent = storageObj[num]
            maxElement = parseInt(num)
        }
    }
    return maxElement
};