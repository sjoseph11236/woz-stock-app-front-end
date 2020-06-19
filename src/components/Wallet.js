import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPurchaseTickerDataThunk, gotError, clearError, addTransactionThunk } from '../store/reducers/transaction';
import { purchaseThunk } from '../store/reducers/user';
import { updatePortfolioThunk } from '../store/reducers/portfolio';

class  Wallet extends Component {
  constructor() {
    super()
    this.state = { 
      ticker: '',
      quantity: '',
      error: '',
      inputColors: {
        ticker:'',
        quantity:''
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkIfCanAfford = this.checkIfCanAfford.bind(this);
    this.checkIfWholeNumber = this.checkIfWholeNumber.bind(this);
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    const { getPurchaseTickerDataThunk, 
          gotError, 
          clearError, 
          purchaseThunk, 
          updatePortfolioThunk, 
          addTransactionThunk } = this.props;
    const { ticker, quantity } = this.state;

    // Check if quantity is whole number
    const isWholeNumber = this.checkIfWholeNumber();
    if(!isWholeNumber) {
      gotError('Amount must be a whole number');
      this.setState({inputColors:{quantity:'is-danger'}})
      setTimeout(() => { 
        clearError()
        this.setState({inputColors:{ quantity:''}})
      }, 3000);
      return;
    } 

    // Get ticker and latest Price
    await getPurchaseTickerDataThunk(ticker);
    if(this.props.error){
      this.setState({inputColors:{ticker:'is-danger'}});
      setTimeout(() => { 
        clearError();
        this.setState({inputColors:{ ticker:''}});
      }, 3000);
      return;
    }

    // Check if user can afford. 
    const canAfford = this.checkIfCanAfford();
    if(!canAfford)  {
      gotError("Can't afford, try a different amount.");
      this.setState({inputColors:{quantity:'is-danger'}});
      setTimeout(() => { 
        clearError();
        this.setState({inputColors:{ quantity:''}});
      }, 3000);
    }
    else { 
      
      const transaction = { 
        type: 'BUY',
        symbol: ticker.toUpperCase(),
        price: Math.round(this.props.purchase.latestPrice) * 100,
        quantity: Number(quantity),
        totalValue:(Math.round(this.props.purchase.latestPrice) * 100 ) * Number(quantity)
      }
      const purchasedStock = { 
        symbol: ticker.toUpperCase(),
        name: this.props.purchase.name,
        quantity: Number(quantity)
      }
      
      // update user cash
      await purchaseThunk(transaction.totalValue);
      // update user portfolio 
      await updatePortfolioThunk(purchasedStock);
      // add transaction
      await addTransactionThunk(transaction);

      this.setState({
        ticker: '',
        quantity: '',
      });
    }
  };

  checkIfWholeNumber() {
    const { quantity } = this.state;
    return  Number.isInteger(Number(quantity));
  };

  checkIfCanAfford(){
    const { purchase, cash } = this.props;
    const { quantity } = this.state;
    const price = Math.round(purchase.latestPrice);

    // Calculate total value of transaction. 
    const total = price * quantity * 100;
    if(total > cash) return false;
    return true;
  };
  
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { ticker, quantity, inputColors } = this.state;
    const { cash, error } = this.props;
    return ( 
      <div className="tile is-parent">
        <article className="tile is-child notification is-success">
          <div className="content">
            <h1 className="title">Cash - ${ cash / 100 } </h1>
            <p className="subtitle">Start buying Shares</p>
            <div className="content">
              <form onSubmit= { this.handleSubmit}>
                <div className="field">
                  <label className="label">Ticker</label>
                  <div className="control">
                    <input className={`input ${inputColors.ticker}`} type="text" placeholder="Ticker" name="ticker" onChange={this.handleChange} value={ticker} />
                  </div>
                </div>
    
                <div className="field">
                  <label className="label">Amount</label>
                  <div className="control">
                    <input className={`input ${inputColors.quantity}`} type="text" placeholder="Qty" name="quantity" onChange={this.handleChange} value={quantity}/>
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <button className="button is-link"  disabled={ ticker && quantity ? false : true }>Buy</button>
                    <div>
                      <br/>
                      { error && <div className='has-text-grey-darker'>{ error }</div> }
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </article>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cash: state.user.cash,
    purchase: state.transaction.purchase,
    error: state.transaction.error
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getPurchaseTickerDataThunk: symbols => dispatch(getPurchaseTickerDataThunk(symbols)),
    updatePortfolioThunk: purchasedStock => dispatch(updatePortfolioThunk(purchasedStock)),
    addTransactionThunk: transaction => dispatch(addTransactionThunk(transaction)),
    gotError: message => dispatch(gotError(message)),
    purchaseThunk: amount => dispatch(purchaseThunk(amount)),
    clearError: () => dispatch(clearError())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);