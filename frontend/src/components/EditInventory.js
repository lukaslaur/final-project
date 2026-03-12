import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { getInventory, updateInventory } from '../services/api';

const EditInventory = () => {
  const [formData, setFormData] = useState({
    title:'',
    description:'',
    category:'Other',
    isPublic: false,
    version: 1
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();

  const categories = ['Equipment', 'Furniture', 'Book', 'Other'];

  useEffect(() => {
    fetchInventory();
  }, [id]);

  const fetchInventory = async () => {
    try{
      const response = await getInventory(id);
      const inventory = response.data;
      setFormData({
        title: inventory.title,
        description: inventory.description || '',
        category: inventory.category,
        isPublic: inventory.isPublic,
        version: inventory.version
      });
      setError('');
    }catch(err){
      setError('Failed to load inventory');
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  const handleChange = (e) =>{
    const {name, value, type, checked} = e.target;
    setFormData(prev => ({
      ...prev,
      [name] : type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await updateInventory(id, formData);
      navigate('/inventories');
    }catch(err){
      if(err.response?.status===409){
        setError('This inventory was modified by another user. Refresh and try again.');
      }else{
        setError(err.response?.data?.error || 'failed to update inventory');
      }
      console.error(err);
    }finally{
      setSaving(false);
    }
  };

  if (loading) { 
    return <div className='text-center mt-5'>Loading inventory...</div>;
  }
  return (
    <div className='row justify-content-center'>
      <div className='col-md-8'>
        <div className='card'>
          <div className='card-body'>
            <h2 className='text-center mb-4'>
              Edit Inventory
            </h2>
            {error && (
              <div className='alert alert-danger'>{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='title' className='form-label'>
                  Title *
                </label>
                <input type='text' className='form-control' id='title' name='title' value={formData.title} onChange={handleChange} required/>
              </div>
              <div className='mb-3'>
                <label htmlFor='description' className='form-label'>Description</label>
                <textarea className='form-control' id='description' name='description' rows='3' value={formData.description} onChange={handleChange}/>
              </div>
              <div className='mb-3'>
                <label htmlFor='category' className='form-label'>Category</label>
                <select className='form-control' id='category' name='category' value={formData.category} onChange={handleChange}>
                  {categories.map (val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <div className='mb-3 form-check'>
                <input type='checkbox' className='form-check-input' id='isPublic' name='isPublic' checked={formData.isPublic} onChange={handleChange}/>
                <label className='form-check-label' htmlFor='isPublic'>
                  Make this inventory public
                </label>
              </div>
              <div className='d-flex gap-2'>
                <button type='submit' className='btn btn-primary' disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type='button' className='btn btn-secondary' onClick={()=>navigate('/inventories')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default EditInventory;