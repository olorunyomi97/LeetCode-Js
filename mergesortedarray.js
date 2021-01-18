/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
const merge = (nums1, m, nums2, n) => {
    //nums1 = [1,0]
    //m = 1
    //num2 = [2]
    //n = 1
    while (n > 0 && m > 0) {
        //(n > 0) {
        //nums1[n - 1] = nums2[n - 1];
        //n--;
        //}
   if (nums1[m - 1] > nums2[n - 1]) { // nums1 is greater so merge nums2 into nums1
     nums1[m + n - 1] = nums1[m - 1];
     m--;
   } else {
     nums1[m + n - 1] = nums2[n - 1];
     n--;
   }
 }

 while (n > 0) {
   nums1[n - 1] = nums2[n - 1];
   n--;
 }
};