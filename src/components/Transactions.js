import React from 'react';
import Receipts from './Receipts';
import { connect } from 'react-redux';

const Transactions = ({ transactions }) => {

  return (  
    <section className="section">
      <div className="tile is-parent">
        <article className="tile is-child notification">
          <div className="content">
            <h1 className="title">Transactions
          </h1>
            <div className="content">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Ticker</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Total Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map( transaction => { 
                    return <Receipts key={transaction.id} transaction={transaction} />
                  })}
                </tbody>
              </table>
            </div>  
            </div>
          </div>
        </article>
      </div>
    </section>
    
  );
}

const mapStateToProps = state => { 
  return { 
    transactions: state.transaction.transactions
  }
}
export default connect(mapStateToProps, null)(Transactions);