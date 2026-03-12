import React, {useState, useEffect} from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getInventory, deleteInventory } from '../services/api';
import { useAuth } from '../context/AuthContext';

const InventoryDetail = () =>{
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();

    useEffect(()=>{
        fetchInventory();
    }, [id]);

    const fetchInventory = async () =>{
        try{
            const response = await getInventory(id);
            setInventory(response.data);
            setError('');
        }catch(err){
            setError('Failed to load inventory');
            console.error(err);
        }finally{
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if(!window.confirm("Are you sure you want to delete this inventory?")){
            return;
        }
        try{
            await deleteInventory(id);
            navigate('/inventories');
        }catch(err){
            setError('Failed to delete inventory');
            console.error(err);
        }
    };
    const canEdit = user && (user.id === inventory?.ownerID || user.role === 'admin');
    if(loading){
        return <div className='text-center mt-5'>Loading inventory...</div>
    }
    if (error){
        return (
            <div className='alert alert-danger mt-5'>
                {error}
                <div className='mt-3'>
                    <Link to="/inventories" className='btn btn-primary'>
                        Back to inventories
                    </Link>
                </div>
            </div>
        )
    };

    if (!inventory){
        return (
            <div className='alert alert-warning mt-5'>
                Inventory not found
                <div className='mt-3'>
                    <Link to='/inventories' className='btn btn-primary'>
                        Back to inventories
                    </Link>
                </div>
            </div>
        )
    };
    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2>
                    {inventory.title}
                </h2>
                <div>
                    <Link to='/inventories' className='btn btn-secondary me-2'>
                        Back to list
                    </Link>
                    {canEdit && (
                        <>
                            <Link to={`/inventories/${id}/edit`} className='btn btn-warning me-2'>
                                Edit
                            </Link>
                            <button onClick={handleDelete} className="btn btn-danger">
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
            {error && <div className='alert alert-danger'>{error}</div>} 
            <div className='card mb-4'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <h5>
                                Details
                            </h5>
                            <table className='table'>
                                <tbody>
                                    <tr>
                                        <th style={{width: '150px'}}>
                                            Category
                                        </th>
                                        <td>
                                            <span className='badge bg-secondary'>
                                                {inventory.category}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Description
                                        </th>
                                        <td>
                                            {inventory.description || '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Owner
                                        </th>
                                        <td>
                                            {inventory.owner?.name || 'Unknown'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Created
                                        </th>
                                        <td>
                                            {new Date(inventory.createdAt).toLocaleString()}
                                            </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Last Updated
                                        </th>
                                        <td>
                                            {new Date(inventory.updatedAt).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            Access
                                        </th>
                                        <td>
                                            {inventory.isPublic ? (
                                                <span className='badge bg-success'>
                                                    Public
                                                </span>
                                            ) : (
                                                <span className='badge bg-warning'>
                                                    Private
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='col-md-6'>
                            <h5>
                                Statistics
                            </h5>
                            <table className='table'>
                                <tbody>
                                    <tr>
                                        <th style={{width: '150px'}}>
                                            Total Items
                                        </th>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <th>Writers</th>
                                        <td>{inventory.writers?.length || 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InventoryDetail;