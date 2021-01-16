/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// expected input : nums param (array)
//                  and a target
const twoSum = (nums, target) => {
    let storage = {};  //store the number we checking for
        //iterate the given array [2,7,11,15] = nums
    
    for (let [index, num] of nums.entries()) {
        //now we extracting the index and actual number from the number of entries
        //next thing is to check if out index value is not undefined
        if(storage[num] !== undefined)
            return [storage [num],index];
        //if the number doesnt exist
        storage[target-num] = index;
    } 
};

/* [2,7,11,15]
on going through the loop the first time
value/num = 2
index = 0
storage at num 2 doesnt exist cos its an empty object
now taking the target and subtracting the num from it (9-2)

storage {
 7 ; key
 0 ; index {now i have the index of where that particular element would be}
}

looping again for the second time 
value/num = 7
index = 1


*/ 