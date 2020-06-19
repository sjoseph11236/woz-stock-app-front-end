import axios from 'axios';
import API_URL from '../../util/api';
/**
 * ACTION TYPES
 */
const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS';
const GOT_PURCHASE = 'GOT_PURCHASE';
const CLEAR_TRANSACTIONS = 'CLEAR_TRANSACTIONS';
const GOT_ERROR = 'GOT_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';
/**
 * INITIAL STATE
 */

const initialState  = { 
  transactions : [],
  purchase: {},
  error: ''
};

/**
 * ACTION CREATORS
 */

const gotTransactions = transactions => { 
  return { 
    type: GOT_TRANSACTIONS,
    transactions
  }
};

const gotPurchase = purchase => { 
  return { 
    type: GOT_PURCHASE,
    purchase
  }
};

export const gotError = message => { 
  return { 
    type: GOT_ERROR,
    message
  }
};

export const clearError = () => { 
  return { 
    type: CLEAR_ERROR
  }
}

export const clearTransactions = () => { 
  return { 
    type: CLEAR_TRANSACTIONS
  }
}
/**
 * THUNK CREATORS
 */

export const getPurchaseTickerDataThunk = symbols => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${API_URL}/api/iex/stock/${symbols}`);
      dispatch(gotPurchase(data[0]));
    } catch (error) {
      dispatch(gotError("Ticker symbol doesn't exisit, Try different one"));
      setTimeout(() => { 
        dispatch(clearError());
      }, 3000);
      console.error(error);
    }
  };
}

export const getTransactionsThunk = userId => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${API_URL}/api/transactions/${userId}`)
      dispatch(gotTransactions(data));
    } catch (error) {
      console.error(error);
    }
  } 
}

export const addTransactionThunk = transaction => {
  return async dispatch => {
    try {
      const { data } = await axios.post(`${API_URL}/api/transactions/`, transaction);
      dispatch(gotTransactions(data));
    } catch (error) {
      console.error(error);
    }
  }
}

const transaction = (state = initialState, action) => {
  switch(action.type) { 
    case GOT_TRANSACTIONS: 
      return { ...state, transactions: action.transactions };
    case GOT_PURCHASE: 
      return { ...state, purchase: action.purchase };
    case GOT_ERROR:
      return { ...state, error: action.message };
    case CLEAR_ERROR:
      return { ...state, error: '' };
    case CLEAR_TRANSACTIONS:
      return { ...state, transactions: [] };
    default: 
      return state;
  }
}

export default transaction;