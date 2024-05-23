import React from 'react';
import './App.css';
import BookTable from './BookTable';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Author Dashboard</h1>
      </header>
      <BookTable />
    </div>
  );
};

export default App;
