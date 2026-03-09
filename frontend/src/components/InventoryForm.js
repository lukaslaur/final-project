import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { createInventory } from '../services/api';

function InventoryForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        isPublic: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const categories = ['Equipment', 'Furniture', 'Book', 'Other'];

    const handleChange = (e) => {
        const {name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            await createInventory(formData);
            navigate('/inventories')
        }catch (err){
            setError(err.response?.data?.error || 'Failed to create inventory');
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

  return (
    <div className='row justify-content-center'>
        <div className='col-md-8'>
            <div className='card'>
                <div className='card-body'>
                    <h2 className='text-center mb-4'> Create new inventory</h2>
                    {error && (
                        <div className='alert alert-danger'>{error}</div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='title' className='form-label'>
                                Title
                            </label>
                            <input
                            type='text'
                            className='form-control'
                            id='title'
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            required
                            >
                            </input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='description' className='form-label'>
                                Description
                            </label>
                            <textarea
                            className='form-control'
                            id='description'
                            name='description'
                            rows='3'
                            value={formData.description}
                            onChange={handleChange}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='category' className='form-label'>
                                Category
                            </label>
                            <select className='form-control'
                            id='category'
                            name='category'
                            value={formData.category}
                            onChange={handleChange}
                            >
                                {categories.map(val => {
                                    return <option key={val} value={val}>{val}</option>
                                })}
                            </select>
                        </div>
                        <div className='mb-3 form-check'>
                            <input
                            type='checkbox'
                            className='form-check-input'
                            id='isPublic'
                            name='isPublic'
                            checked={formData.isPublic}
                            onChange={handleChange}
                            />
                            <label className='form-check-label' htmlFor='isPublic'>
                                Make this inventory public
                            </label>
                        </div>
                        <div className='d-flex gap-2'>
                            <button className='btn btn-primary'
                                type='submit'
                                disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Inventory'}
                                </button>
                            <button className='btn btn-secondary'
                            type='button'
                            onClick={() => navigate('/inventories')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default InventoryForm;