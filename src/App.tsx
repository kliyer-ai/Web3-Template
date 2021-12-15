import React from 'react';
import './App.css';
import { Web3Provider } from './context/Web3Context'
import { Navbar } from './components/Navbar'
import { ContractProvider } from './context/ContractContext';
import { ViewGenerators } from './pages/ViewGenerators'



function App() {
  return (
    <div className="App">
      <Web3Provider>
        <Navbar />
        <h1>hello world</h1>

        <ContractProvider>
          <ViewGenerators />
        </ContractProvider>

      </Web3Provider >


    </div >
  );
}


export default App;
