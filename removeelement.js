function removeElement (nums, val) {
    // check if my nums array is true or not 
    if (!nums) return 0;
    // now we want to iterate every element of the nums array
    for (let i = 0; i < nums.length; i++) {
        // now we check if the nums = the value we are looking for 
        if (nums [i] === val){
            // we now splice ( remove the first value in the nums array and reset the index position)
        nums.splice(i,1);
        i--
        }
    }
    return nums.length
}