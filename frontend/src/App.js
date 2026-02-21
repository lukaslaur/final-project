import React, {useState, useEffect} from 'react';
function App(){

  const [apiStatus, setApiStatus] = useState("Checking...");

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'https://inventory-app-api-nupk.onrender.com';
    fetch(`${API_URL}/api/health`)
    .then(res => res.json())
    .then(data => setApiStatus(data.message))
    .catch(err => setApiStatus('Backend not reachable'));
  }, []);

  return (
    <div style={{padding:'20px'}}>
      <h1>Inventory Management System</h1>
      <p>Backend Status: {apiStatus}</p>
    </div>
  )

}
export default App;