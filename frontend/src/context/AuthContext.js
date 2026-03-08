import React, {createContext, useState, useContext, useEffect} from 'react';
import {login as apiLogin, register as apiRegister} from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider =( {children} ) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if(token && userData){
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    },[]);

    const login = async (email, password) => {
    try{
        const response = await apiLogin (email, password);
        const {token, user} = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return {success: true};
    }catch(error){
        return {
            success:false,
            error:error.response?.data?.error || 'Login failed'
        };
     }
        }
    const register = async (email, password, name)=> {
        try{
            const response = await apiRegister(email, password, name);
            const {token, user} = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return {success: true};
        }catch(error){
            return{
                success:false,
                error:error.response?.data?.error || 'Registration failed'
            }
        }
    }
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }
    const value = {
        user,
        login,
        register,
        logout,
        loading
    } 
    return (
        <AuthContext.Provider value = {value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}