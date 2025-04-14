import React from 'react'

export default function MinimalTest() {
  console.log('MinimalTest rendering')
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'red' }}>Minimal Test Component</h1>
      <button 
        style={{ padding: '10px', background: 'blue', color: 'white' }}
        onClick={() => console.log('Button clicked')}
      >
        Test Button
      </button>
    </div>
  )
}
