/**
 * @param {number[]} nums
 * @return {number}
 */
const removeDuplicates = (nums) => {
    if (nums.length === 0) return 0; //return 0 if array is empty
    //declare pointers i and j to be = 0 & 1
    let i = 0
    let j = 1
    while (j < nums.length) { //while loop to check if j = i
        if(nums[j] !== nums[i]) {
            i++ // if not increment i by 1
            nums[i] = nums[j] //copy number with index j to i
            j++ //increment j by 1
        } else {
            j++ // equal so increment j
        }
    }
    return 1 + i //returning the length of the numbers
    
};