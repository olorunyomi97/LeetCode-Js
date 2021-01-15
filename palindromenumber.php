<?php

class Solution {

/**
 * @param Integer $x
 * @return Boolean
 */
function isPalindrome($x) {
     $length = strlen($s);
    $middle = $length / 2;
    $end = $length - 1;
    
    for($i = 0; $i <= (int)$middle; $i++) {
        if ($s[$i] != $s[$end]) {
            $s1 = substr_replace($s, '', $i, 1);
            $s2 = substr_replace($s, '', $end, 1);
            
            return ($s1 == strrev($s1)) || ($s2 == strrev($s2));
        }
        
        $end--;
    }
    
    return true;
}

}