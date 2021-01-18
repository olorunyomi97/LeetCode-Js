/**
 * @param {number} numRows
 * @return {number[][]}
 */
const generate = (numRows) => {
    let triangle = []; //define or declare the triangle
    //first base case -> If a user requests zero rows, they get zero rows
    if(numRows == 0){
        return triangle
        }
    //using for loop to iterate the rows
    for (let i = 0; i < numRows; i++) {
        triangle[i] = [];
    //second base case -> the first row of the triangle and the first element of all rows are always 1.
        triangle[i][0] = 1;
        
    //repeating iteration for second row. While I iterate the rows, I also use the second loop to build the elements of each row.
        for (let j = 1; j < i; j++) {
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j]
            }
    //The last element of all rows are always 1.
        triangle[i][i] = 1;
        }

    return triangle;
        
    }
 
