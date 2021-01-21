/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    var profit = null
    var maxProfit = 0
    prices.forEach(function(buy,index){
        let rest = prices.slice (index + 1)//all elements to the right
            if (rest){
                let sell = Math.max(...rest)
                sell > buy ? profit = sell - buy : null
                profit > maxProfit ? maxProfit = profit : null
        }
    })
    return maxProfit
};