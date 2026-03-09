import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './auth/Login';
import Register from './auth/Register';
import InventoryList from './components/InventoryList';
import InventoryForm from './components/InventoryForm';

const InventoryDetail = () => <div>Inventory Detail (TBD)</div>;

const PrivateRoute = ({children}) => {
  const {user} = useAuth();
  return user ? children : <Navigate to ="/login"/>
};

function AppContent(){
  const {user, logout} = useAuth();

  return (
    <div className='container mt-4'>
      <nav className='navbar navbar-expand-lg navbar-light bg-light mb-4'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='/'>Inventory Manager</a>
          <div className='navbar-nav ms-auto'>
            {user ? (
              <>
                <span className='nav-link'>Hello, {user.name}</span>
                <button className='btn btn-outline-danger' onClick={logout}>Logout</button>
              </>
            ): (
              <>
                <a className='nav-link' href='/login'>Login</a>
                <a className='nav-link' href='/register'>Register</a>
              </>
            )}
          </div>
        </div>
      </nav>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/inventories' element={
        <PrivateRoute>
          <InventoryList/>
        </PrivateRoute>
      }/>
      <Route path = '/inventories/new' element = {
        <PrivateRoute>
          <InventoryForm/>
        </PrivateRoute>
      }/>
      <Route path = '/inventories/:id' element={
        <PrivateRoute>
          <InventoryDetail/>
        </PrivateRoute>
      }/>
      <Route path = '/' element={
        <Navigate to='/inventories'/>
        }/>
    </Routes>
    </div>
  )
}


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
    <Router>
      <AuthProvider>
        <div style={{padding: '20px'}}>
          <p>Backend Status: {apiStatus}</p>
          <AppContent/>
        </div>
      </AuthProvider>
    </Router>
  )

}
export default App;