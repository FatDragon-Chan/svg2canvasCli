import React, { useState } from 'react';
import './App.less';
import Index from './modules/index/index'

import './index.css'

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
