import React, { useEffect } from 'react';
import Table from './Table';
import { connect } from 'react-redux';
import { dynamicUpdatePortfolioThunk } from '../store/reducers/portfolio';

const Portfolio = ({ stocks, portfolioTotal, dynamicUpdatePortfolioThunk }) => {

  useEffect(() => {
    const interval = setInterval(()=> { 
      dynamicUpdatePortfolioThunk();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return ( 
    <div className="tile is-parent">
      <article className="tile is-child notification">
        <div className="content">
          <h1 className="title">Portfolio - ${ portfolioTotal / 100}</h1>
          <div className="content">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Name</th>
                  <th>Change</th>
                  <th>Change Percent</th>
                  <th>Price</th>
                  <th>Shares</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                { stocks.map( (stock, id ) => {
                  return <Table key={id} stock={stock} />
                })}
              </tbody>
            </table>
          </div>  
          </div>
        </div>
      </article>
    </div>
  );
}

const mapStateToProps = state => { 
  return { 
    stocks: state.portfolio.stocks,
    portfolioTotal: state.portfolio.portfolioTotal
  }
}

const mapDispatchToProps = dispatch => { 
  return {
    dynamicUpdatePortfolioThunk: () => dispatch(dynamicUpdatePortfolioThunk()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);