/**
 * @param {number} x
 * @return {number}
 */
// check if we're dealing with a positive or negative number
// if negative we can do the same thing as what we would do if it were positive
const reverse = (x) => {
    if (x < 0) return -1 * reverse(-x);
    // passes the +ve version into the reverse then it is returned with the -1
    // putting the 123 back in the function and its positive so it skips the first condition
    const solution = (x+"").split('').reverse().join('');
    // converting the number into string by adding an empty string to the x value 
    // then you split it, reverse and join

    // for the 32-bit integer criteria
    // if the solution is greater return zero otherwise the solution
    return (solution > 2**31 -1) ? 0 : solution;
};
// put 123 in the const of (x)
// it would skip the second condition cos the conditon only applies to negative values
// then it turns the value int a string and repeat