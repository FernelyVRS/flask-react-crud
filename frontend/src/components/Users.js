import {useState, useEffect} from 'react'

const API = process.env.REACT_APP_API;

export const Users = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const [editing, setEditing] = useState(false)
    const [id, setId] = useState('')

    const [users, setUsers] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!editing){
            const response = await fetch(`${API}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            await response.json();
        } else{
            const response = await fetch(`${API}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            await response.json();
            setEditing(false);
            setId('');

        }

        await getUsers();

        setName('');
        setEmail('');
        setPassword('');
    }

    const getUsers = async () => {
        const response = await fetch(`${API}/users`);
        const data = await response.json();
        setUsers(data);
    }

    useEffect(() => {
        getUsers();
    }, [])
    
    const editUser = async (id) => {
        const response  = await fetch(`${API}/user/${id}`);
        const data = await response.json();

        setEditing(true);
        setId(id);

        setName(data.name);
        setEmail(data.email);
        setPassword(data.password);
        
        await getUsers();
    }

    const deleteUser = async (id) => {
        const userResponse = window.confirm('Are you sure you want to delete it?')
        if (userResponse){
            const response  = await fetch(`${API}/users/${id}`, {
                method: 'DELETE'
            });
            await response.json();
            await getUsers();
        }
    }

    return(
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">   
                      <input 
                        type="text"  
                        onChange={e =>setName(e.target.value)}
                        value={name}
                        className="form-control"
                        placeholder="Name"
                        autoFocus/>
                    </div>
                    <div className="form-group">   
                      <input 
                        type="email"  
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        className="form-control"
                        placeholder="Email"/>
                    </div>
                    <div className="form-group">   
                      <input 
                        type="password"  
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        className="form-control"
                        placeholder="Password"/>
                    </div>
                    <button className="btn btn-primary btn-block">
                        {editing ? 'Update' : 'Create'}
                    </button>
                </form>
            </div>
            <div className="col-md-8">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user =>(
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>
                                    <button 
                                    className="btn btn-info btn-sm btn-block"
                                    onClick={(e) => editUser(user._id)}>
                                        Edit
                                    </button>
                                    <button 
                                    className="btn btn-danger btn-sm btn-block"
                                    onClick={(e) => deleteUser(user._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}