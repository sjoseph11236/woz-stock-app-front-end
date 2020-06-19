import axios from 'axios';
import API_URL from '../../util/api';
import history from '../../history';
/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';
const PURCHASE = 'PURCHASE';


/**
 * INITIAL STATE
 */
const defaultUser = {};

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user});
const removeUser = () => ({type: REMOVE_USER});
const purchase = amount =>({type: PURCHASE, amount});
/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
};

export const auth = (name, email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`${API_URL}/auth/${method}`, { name, email, password });
    dispatch(getUser(res.data))
    history.push('/');
  } catch (authError) {
    console.error(authError);
    dispatch(getUser({error: authError}))
    setTimeout(() => {
      dispatch(getUser({error: ''}));
    }, 3000);
  }
}
// Redux Thunk is a middleware that lets you call action creators that return a function instead of an action object. That function receives the store’s dispatch method, which is then used to dispatch regular synchronous actions inside the body of the function once the asynchronous operations have completed.
// https://www.digitalocean.com/community/tutorials/redux-redux-thunk#:~:text=Redux%20Thunk%20is%20a%20middleware,the%20asynchronous%20operations%20have%20completed.
export const logout = () => async dispatch => {
  try {
    await axios.post(`${API_URL}/auth/logout`)
    dispatch(removeUser())
    history.push('/signin');
  } catch (err) {
    console.error(err)
  }
}

export const purchaseThunk = amount => async (dispatch, getState) => {
  try {
    const { user } = getState();
    const difference = user.cash - amount;
    const { data } = await axios.put(`${API_URL}/api/user/${user.id}`, { cash: difference });
    dispatch(purchase(data.cash));
  } catch (err) {
    console.error(err);
  }
}

const user = (state = defaultUser, action) => {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    case PURCHASE:
      return {...state, cash: action.amount }; 
    default:
      return state;
  }
}

export default user;