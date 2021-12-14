import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Web3Provider } from './context/Web3Context'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <div className="App">
      <Web3Provider>
        <Navbar />
        <h1>hello world</h1>
      </Web3Provider>
      {/* <h1>hello world</h1> */}
    </div>
  );
}

export default App;
