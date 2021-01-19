/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    let previous = null;
    while (head) {     // head starts as 1, 2, 3, 4, 5
        const next = head.next; // next as 2,3,4,5
        const current = head;   // current as 1,2,3,4,5
        current.next = previous; // current.next = null; current = 1, null
        head = next;
        previous = current;
        
    }
    return previous;
};