import React from 'react'
import { useState } from 'react';


function Access() {
  const [key, setKey] = useState('New');
  return (
    <div id="controlled-tab-example" className="mb-3">
      <div className="flex border-b">
        <button
          className={`p-4 ${key === 'New' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setKey('New')}
        >
          New Access
        </button>
        <button
          className={`p-4 ${key === 'Existing' ? 'border-b-2 border-purple-500' : ''}`}
          onClick={() => setKey('Existing')}
        >
          Existing Access
        </button>
      </div>
      <div className="p-4">
        {key === 'New' && <div>Tab content for New Access</div>}
        {key === 'Existing' && <div>Tab content for Existing Access</div>}
      </div>
    </div>

  )
}

export default Access