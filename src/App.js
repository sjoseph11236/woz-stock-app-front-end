import React, { Component } from 'react';
import Nav from './components/Nav';
import Routes from './routes';

class App extends Component { 
  render() {
    return(
      <div>
        <section className="hero is-primary is-bold">
          <div className="hero-body">
              <h1 className="title">
                Stock Portfolio
              </h1>
          </div>
        </section>
        <section className="section">
          <Nav />
          <Routes />
        </section> 
      </div>    
    )
  }
}


export default App;


