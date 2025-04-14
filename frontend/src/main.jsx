console.log('Main.jsx executing') // Debug log
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global error handler to catch React errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Add visible error display to the page
  const errorEl = document.createElement('div');
  errorEl.style.padding = '20px';
  errorEl.style.backgroundColor = '#ffdddd';
  errorEl.style.border = '1px solid #ff0000';
  errorEl.style.borderRadius = '5px';
  errorEl.style.margin = '20px';
  errorEl.style.fontFamily = 'monospace';
  errorEl.style.whiteSpace = 'pre-wrap';
  errorEl.style.overflow = 'auto';
  errorEl.style.maxHeight = '80vh';
  
  errorEl.innerHTML = `
    <h2 style="color: #ff0000;">React Rendering Error</h2>
    <p><strong>Message:</strong> ${event.error?.message || 'Unknown error'}</p>
    <p><strong>Stack:</strong></p>
    <pre>${event.error?.stack || 'No stack available'}</pre>
  `;
  
  document.body.prepend(errorEl);
});

const rootElement = document.getElementById('root')
console.log('Root element:', rootElement) // Debug log

if (!rootElement) {
  console.error('Failed to find root element')
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
    console.log('App rendered successfully')
  } catch (error) {
    console.error('Error rendering app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; background-color: #ffdddd; border: 1px solid red; border-radius: 5px;">
        <h2>Failed to render application</h2>
        <p>${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}
