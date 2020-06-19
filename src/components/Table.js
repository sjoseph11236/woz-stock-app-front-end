import React from 'react';

const Table = ({ stock }) => {
  return ( 
    <tr className={stock.colorize}>
      <td>{stock.symbol}</td>
      <td>{stock.name}</td>
      <td>{stock.change}</td>
      <td>{stock.changePercent}</td>
      <td>{stock.latestPrice}</td>
      <td>{stock.quantity}</td>
      <td>${stock.latestPrice  * stock.quantity}</td>
    </tr>
  );
}

export default Table;