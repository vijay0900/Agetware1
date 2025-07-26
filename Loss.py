def minimize_loss(prices):
    n = len(prices)
    min_loss = float('inf')
    buy_year = sell_year = -1

    for i in range(n):
        for j in range(i + 1, n):
            if prices[j] < prices[i]:  
                loss = prices[i] - prices[j]
                if loss < min_loss:
                    min_loss = loss
                    buy_year = i + 1  
                    sell_year = j + 1

    if buy_year == -1:
        return "No loss possible"
    
    return {
        "buy_year": buy_year,
        "sell_year": sell_year,
        "loss": min_loss
    }


prices = [20, 15, 7, 2, 13]
result = minimize_loss(prices)
print(result)
