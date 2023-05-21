import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [credentials, setCredentials] = useState({name: "" , email: "", password: "" , cpassword: ""});
  let history = useNavigate();
  const handleSubmit = async (e) => {
      e.preventDefault();
      const {name , email , password} = credentials;
      const response = await fetch('http://localhost:5000/api/auth/createuser', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name , email , password })
      });
      const json = await response.json();
      console.log(json.success);
      if(json.success)
      {
          localStorage.setItem('auth-token' , json.authtoken)
          history('/');
      }
      else
      {
          alert("Invalid");
      }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
}
  return (
    <div>
      <div className="container">
        <h2>Welcome to Aninote! Please Signup to continue .</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" onChange={onChange} name='name' aria-describedby="nameHelp" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" onChange={onChange}  minLength={5} name='email' aria-describedby="emailHelp" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" name='password' id="password" minLength={5}  onChange={onChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" name='cpassword' id="cpassword" minLength={5}  onChange={onChange} />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Signup
