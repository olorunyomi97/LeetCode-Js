/**
 * @param {number[]} digits
 * @return {number[]}
 */
const plusOne = (digits) => {
    let carry = true
    for (let i = digits.length - 1; i >= 0; i -= 1) {
        if (digits[i] === 9 && carry) {
            digits[i] = 0;
            if (i === 0) {
                digits.unshift(1);
                break;
            }
        } else if (carry) {
            digits[i] += 1;
            carry = false;
        }
    }
    return digits;
};