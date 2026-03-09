import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {getInventories, deleteInventory} from '../services/api';
import {useAuth} from '../context/AuthContext'

const InventoryList = () => {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {user} = useAuth();
    useEffect(() => {
        fetchInventories();
    },[]);
    const fetchInventories = async () => {
        try{
            const response = await getInventories();
            setInventories(response.data);
            setError('');
        } catch (err){
            setError('Failed to load inventories');
            console.log(err);
        } finally{
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inventory?')){
            return;
        }
        try { 
            await deleteInventory(id);
            setInventories(inventories.filter(inv => inv.id !== id));
        } catch(err){
            setError('Failed to delete inventory');
            console.log(err);
        }
    };
    if (loading){
        return <div className='text-center mt-5'>Loading inventories...</div>;
    }

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2>My inventories</h2>
                <Link to='/inventories/new' className='btn btn-primary'>Create new inventory</Link>
            </div>
            {error && (<div className='alert alert-info'>{error}</div>)}
            {inventories.length === 0 ? (
                <div className='alert alert-info'>No inventories yet. Click 'Create new inventory' to create an inventory.</div>
            ) : (
                <div className='table-responsive'>
                    <table className='table table-striped table-hover'>
                        <thead className='table-dark'>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Owner</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventories.map((inventory) => (
                                <tr key={inventory.id}>
                                    <td>
                                        <Link to={`/inventories/${inventory.id}`}>
                                                {inventory.title}
                                        </Link> 
                                        </td>
                                        <td>{inventory.description || '-'}</td>
                                        <td>
                                            <span className='badge bg-secondary'>
                                                {inventory.category}
                                            </span>
                                        </td>
                                        <td>{inventory.owner?.name || 'Unknown'}</td>
                                        <td>{new Date (inventory.createdAt).toLocaleDateString()}</td>
                                        <td>
                                        <div className='btn-group' role='group'>
                                            <Link to={`/inventories/${inventory.id}`} className='btn btn-sm btn-info me-2'>
                                                View
                                            </Link>
                                            {user && (user.id === inventory.ownerID || user.role === 'admin') && (
                                                <>
                                                    <Link to={`/inventories/${inventory.id}/edit`} className='btn btn-sm btn-warning me-2'>
                                                        Edit
                                                    </Link>
                                                    <button onClick={() => handleDelete(inventory.id)} className='btn btn-sm btn-danger'>
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InventoryList;