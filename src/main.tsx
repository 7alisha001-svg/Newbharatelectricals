import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

console.log('[Startup] Application is starting...');

const rootElement = document.getElementById('root');
console.log('[Startup] #root element found:', !!rootElement);

if (!rootElement) {
  document.body.innerHTML = '<div style="color:red;padding:20px;">Critical Error: #root element not found</div>';
} else {
  try {
    console.log('[Startup] Executing createRoot...');
    const root = createRoot(rootElement);
    
    console.log('[Startup] Rendering App within Providers...');
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
    console.log('[Startup] React render triggered successfully.');
  } catch (err: any) {
    console.error('[Startup] Fatal render error:', err);
    rootElement.innerHTML = `<div style="color:red;padding:20px;">
      <h2>Fatal Application Error</h2>
      <pre>${err?.message || String(err)}</pre>
      <pre>${err?.stack || ''}</pre>
    </div>`;
  }
}
