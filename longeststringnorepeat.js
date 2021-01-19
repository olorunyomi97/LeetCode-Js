/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let longest_substring = 0;
    let current_sentence = '';
    let i = 0;
    let storage = [];
    
    while (i < s.length){
        if (storage[s[i]]) {
// if the storage finds a repeating character.
            if (current_sentence.length > longest_substring) {
                longest_substring = current_sentence.length;
            }
//empty substring, move i back to last position, and start collecting over.
/*current_sentence = '';
// Move back to last non-repeating character.
i = storage[s[i]];
storage = [];*/
            
// strip everything up to the first repeating character in our substring, and continue on.
            let letter = current_sentence.indexOf(s[i]);
            current_sentence = current_sentence.substring(letter + 1);
        }
        if (i < s.length) {
            current_sentence += s[i];
            storage[s[i]] = i + 1;
            i++;
        }
        
    }
     if (current_sentence.length > longest_substring) {
        longest_substring = current_sentence.length;
    }
    return longest_substring
    
};
