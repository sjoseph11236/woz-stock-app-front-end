export const updateData = (data, stocks) => { 
  let portfolioTotal = 0;
  data.map((stock, idx ) => {
    if(stocks[idx].symbol === stock.symbol){
      stock.quantity = stocks[idx].quantity;
      stock.latestPrice = Math.round(stock.latestPrice);
      portfolioTotal += ((stock.latestPrice * 100) * stocks[idx].quantity);
    }
    return stock;
  });
  return { data, portfolioTotal};
}

const colorize = data => { 
  data.map(info => {
    if(info.change == 0 ){
      info.colorize = 'has-text-grey';
    }
    else if(info.change < 0 ){
      info.colorize = 'has-text-danger';
    }
    else {
      info.colorize = 'has-text-success';
    }
    return info;
  });
  return data;
}

export default colorize;