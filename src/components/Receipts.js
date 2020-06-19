import React from 'react';

const Receipts = ({ transaction }) => {
  return ( 
    <tr>
      <td>{transaction.type}</td>
      <td>{transaction.stock.symbol} - </td>
      <td>{transaction.quantity}</td>
      <td>@ ${transaction.price / 100 }</td>
      <td>${transaction.totalValue / 100 }</td>
      <td>{new Date(transaction.createdAt).toDateString()}</td>
    </tr>
  );
}

export default Receipts;