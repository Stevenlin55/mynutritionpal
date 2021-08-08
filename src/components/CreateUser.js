import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
    const [username, setUsername] = useState("");

    function onSubmit(e) {
        e.preventDefault();

        const user = {
            username
        }
        console.log(user);

        axios.post('http://localhost:5000/users/add', user)
            .then(res => console.log(res.data))
            .catch(error => console.log(error));
            
        setUsername("");
    }

    return (
        <div className="container">
            <h3>Create a user</h3>
            <form onSubmit={(e) => onSubmit(e)}>
            <div className="form-group"> 
            <label>Username: </label>
            <input type="text"
                required
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
          </div>
          <div className="form-group">
            <input type="submit" value="Create User" className="btn btn-primary mt-3" />
          </div>
            </form>
        </div>
    );
};

export default CreateUser;