import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth } from '../../store';
import { getTransactionsThunk } from '../../store/reducers/transaction';
import { getPortfolioThunk } from '../../store/reducers/portfolio';

class SignIn extends Component {
  constructor() {
    super()
    this.state = { 
      email: '',
      password: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit(evt) {
    evt.preventDefault()
    const email = this.state.email;
    const password = this.state.password;
    await this.props.auth('', email, password, 'login');
    if(this.props.userId){
      await this.props.getPortfolioThunk(this.props.userId);
      await this.props.getTransactionsThunk(this.props.userId);
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { name, email, password } = this.state;
    const { error } = this.props;
    return (  
      <div className="container">   
        <section className="section">
          <div className="box">
            <h1 className='title has-text-centered'>Sign In</h1>
            <form onSubmit={ this.handleSubmit }>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input className="input is-success" type="email" placeholder="Email" name='email'  onChange={this.handleChange} value={email} />
                </div>
              </div>

              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className="input is-success" type="password" placeholder="Password" name='password'  onChange={this.handleChange} value={password}/>
                </div>
              </div>
              
              <div className="field is-grouped">
                <div className="control">
                  <button id="send" className="button is-link">Send</button>
                  <div>
                    <br/>
                    <Link to='/register'>
                      <h2 className='has-text-centered'><u>Register here</u></h2>
                    </Link>
                    <br/>
                    {error && error.response && <div> {error.response.data}</div>}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div> 
    );
  }
};

const mapStateToProps = state => {
  return {
    error: state.user.error,
    userId: state.user.id
  }
};


const mapDispatchToProps = dispatch => {
  return {
    auth: (name, email, password, method) => dispatch(auth(name, email, password, method)),
    getTransactionsThunk: userId => dispatch(getTransactionsThunk(userId)),
    getPortfolioThunk: userId => dispatch(getPortfolioThunk(userId))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);