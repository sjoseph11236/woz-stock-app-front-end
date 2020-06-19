import axios from 'axios';
import colorize from '../../util/helper';
import API_URL from '../../util/api';
import { updateData } from '../../util/helper';
/**
 * ACTION TYPES
 */
const GOT_PORTFOLIO = 'GOT_PORTFOLIO';
const UPDATE_PORTFOLIO = 'UPDATE_PORTFOLIO';
const CLEAR_PORTFOLIO = 'CLEAR_PORTFOLIO';
const UPDATE_TOTAL = 'UPDATE_TOTAL';

/**
 * INITIAL STATE
 */

const initialState  = { 
  portfolioTotal: 0,
  portfolio: {},
  stocks: [],
};

/**
 * ACTION CREATORS
 */

const gotPortfolio = stocks => { 
  return { 
    type: GOT_PORTFOLIO,
    stocks
  }
};

const updatePortfolio = portfolio => {
  return {
    type: UPDATE_PORTFOLIO,
    portfolio
  }
}

const updatePortfolioTotal = portfolioTotal => { 
  return { 
    type: UPDATE_TOTAL,
    portfolioTotal
  }
}

export const clearPortfolio = () => { 
  return { 
    type: CLEAR_PORTFOLIO
  }
}

/**
 * THUNK CREATORS
 */

export const getPortfolioThunk = userId => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${API_URL}/api/portfolio/${userId}`);
      const symbols = data.symbols;
      const stocks = data.stocks;
      dispatch(updatePortfolio({ symbols, stocks }))
      dispatch(getPortfolioStockData(symbols,stocks));
    } catch (error) {
      console.error(error);
    }
  } 
};


export const getPortfolioStockData = (symbols, stocks) => {
  return async dispatch => { 
    try {
      const { data } = await axios.get(`${API_URL}/api/iex/stock/${symbols}`);   
      const updatedData = updateData(data, stocks);
      const colorizedData = colorize(updatedData.data);
      dispatch(gotPortfolio(colorizedData));   
      dispatch(updatePortfolioTotal(updatedData.portfolioTotal));
    } catch (error) {
      console.error(error);
    }
  }
};

export const updatePortfolioThunk = purchasedStock => { 
  return async dispatch => { 
    try {
      const { data } = await axios.post(`${API_URL}/api/portfolio`, purchasedStock);
      const symbols = data.symbols;
      const stocks = data.stocks;
      dispatch(updatePortfolio({ symbols, stocks }))
      dispatch(getPortfolioStockData(symbols,stocks));
    } catch (error) {
      console.error(error);
    }
  }
}

export const dynamicUpdatePortfolioThunk = () => {
  return (dispatch, getState) => { 
    try {
      const { symbols, stocks } = getState().portfolio.portfolio;
      dispatch(getPortfolioStockData(symbols, stocks));
    } catch (error) {
      console.error(error);      
    }
  }
}

const portfolio = (state = initialState, action) => {
  switch(action.type) { 
    case GOT_PORTFOLIO: 
      return { ...state, stocks: action.stocks };
    case UPDATE_PORTFOLIO: 
      return { ...state, portfolio: action.portfolio };
    case CLEAR_PORTFOLIO: 
      return { ...state, stocks: [], portfolioTotal: 0 };
    case UPDATE_TOTAL: 
      return { ...state, portfolioTotal: action.portfolioTotal };
    default: 
      return state;
  }
}

export default portfolio;