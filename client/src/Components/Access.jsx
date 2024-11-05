import React from 'react'
import { useState } from 'react';


function Access() {
  const [key, setKey] = useState('home');
  return (
    <div id="controlled-tab-example" className="mb-3">
      <div className="flex border-b">
        <button
          className={`p-4 ${key === 'home' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setKey('home')}
        >
          Home
        </button>
        <button
          className={`p-4 ${key === 'profile' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setKey('profile')}
        >
          Profile
        </button>
        <button
          className={`p-4 ${key === 'contact' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setKey('contact')}
        >
          Contact
        </button>
      </div>
      <div className="p-4">
        {key === 'home' && <div>Tab content for Home</div>}
        {key === 'profile' && <div>Tab content for Profile</div>}
        {key === 'contact' && <div>Tab content for Contact</div>}
      </div>
    </div>

  )
}

export default Access