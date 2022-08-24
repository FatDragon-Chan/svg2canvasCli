import React, { useState } from 'react';
import './App.less';
import Index from './modules/index/index'

function App() {
  return (
    <div>
      {
        // @ts-ignore
        Index()
      }
    </div>
  );
}

export default App;
