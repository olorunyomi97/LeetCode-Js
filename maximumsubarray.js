function maxSubArray (nums) {
    let solution = nums[0]; //define your solution  
    // iterate your array
    for (let i = 1; i < nums.length; i++) { // starting from 1 cos the value (-2 is less than 0 so why not start from 1)
    nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
    // numbers at i is going to be the math.max of my existing numbers at i either going to be 1
    // or my numbers at i +(the things i've accumulated which is [i-1]) 
    solution = Math.max(solution, nums[i]);
    }
    return solution;
}``