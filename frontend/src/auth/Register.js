import React, {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';   

const Register = ()=>{
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    const {register} = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword){
            return setError('Passwords do not match');
        }
        setLoading (true);
        const result = await register (email, password, name);

        if (result.success){
            navigate('/inventories');
        } else {
            setError(result.error);
        }
        setLoading(false);
    }

    return(
        <div className='row justify-content-center'>
            <div className='col-md-6'>
                <div className='card'>
                    <div className='card-body'>
                        <h2 className='text-center mb-4'>Register</h2>
                        {error && (
                            <div className='alert alert-danger'>{error}</div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label htmlFor='name' className='form-label'>Name</label>
                                <input
                                type='text'
                                className='form-control'
                                id='name'
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                required
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='email' className='form-label'>Email</label>
                                <input
                                type='email'
                                className='form-control'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='password' className='form-label'>Password</label>
                                <input
                                type='password'
                                className='form-control'
                                id='password'
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                                required
                                />
                            </div>
                            <div>
                                <label htmlFor='confirm-password' className='form-label'>Confirm Password</label>
                                <input
                                type='password'
                                className='form-control'
                                id='confirm-password'
                                value={confirmPassword}
                                onChange={(e)=> setConfirmPassword(e.target.value)}
                                required
                                />
                            </div>
                            <button
                            type='submit'
                            className='btn btn-primary w-100'
                            disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                            <Link to="/inventories" className="btn btn-outline-secondary w-100">
                                Browse Inventories (Guest)
                            </Link>
                        </form>
                        <div className='text-center mt-3'>
                            <a href='/login'>Already have an account? Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default Register;