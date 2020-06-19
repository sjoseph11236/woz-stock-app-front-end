import React from 'react';
import Info from './Info';
import { connect } from 'react-redux';


const Chart = ({ chart }) => {
  return ( 
    <section className="section">
      <div className="tile is-parent">
        <article className="tile is-child notification">
          <div className="content">
            <h1 className="title">Chart</h1>
            <div className="content">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>Latest Price</th>
                    <th>Change</th>
                    <th>Change Percent</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.map((stock, idx) => {
                    return <Info key={idx} stock={stock}/>
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
    chart: state.chart.chart
  }
};



export default connect(mapStateToProps, null )(Chart);