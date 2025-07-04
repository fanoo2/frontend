#!/usr/bin/env node

/**
 * Simple smoke test as requested
 */

(async() => {
  try {
    // Test health endpoint
    await fetch('http://localhost:5000/api/health');  
    
    // Test annotation endpoint
    const resp = await fetch('http://localhost:5000/api/annotate', {
      method:'POST', 
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({text:'test'})
    });
    
    const {annotations} = await resp.json();
    
    if(!annotations.length) {
      throw new Error('No annotations');
    }
    
    console.log('OK');
  } catch (error) {
    console.error('FAIL:', error.message);
    process.exit(1);
  }
})();