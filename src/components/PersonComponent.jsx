import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {createPerson, getPerson} from "../services/UserService.js";

const PersonComponent = () => {
  const [username,setUsername]= useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {id} = useParams()

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password:''
  })

  const navigator = useNavigate()

  useEffect(() => {
    if(id){
      getPerson(id).then((response) => {
        setUsername(response.data.username);
        setEmail(response.data.email);
        setPassword(response.data.password);
      }).catch(error => {console.log(error);})
    }
  }, [id]);

  function savePerson(e){
    e.preventDefault();
    if(validateForm()) {
      const person = {username, email, password}
      console.log(person)

      createPerson(person).then((response)=> {
        console.log(response.data)
        navigator('/person')
      })
    }
  }

  function validateForm(){
    let valid = true;

    const errorsCopy = {... errors}

    if(username.trim()){
      errorsCopy.username = '';
    } else {
      errorsCopy.username = "Username is required";
      valid = false;
    }

    if(email.trim()){
      errorsCopy.email = '';
    } else {
      errorsCopy.email = 'Email is required';
      valid = false;
    }

    if(password.trim()){
      errorsCopy.password = '';
    } else{
      errorsCopy.password = 'Password is required';
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  }

  function pageTitle(){
    if(id){
      return <h2 className='text-center'>Update Person</h2>
    } else {
      return <h2 className='text-center'>Register Person</h2>
    }
  }

  return (
      <div className='container'>
        <br/>
        <div className='row'>
          <div className='card col-md-6 offset-md-3 offset-md-3'>
            {
              pageTitle()
            }
            <div className='card-body'>
              <form>
                <div className='form-group mb-2'>
                  <label className='form-label'>Enter username:</label>
                  <input type='text' placeholder='' name='username' value={username} className={`form-control ${errors.username?'is-invalid':''}`}
                         onChange={(e)=> setUsername(e.target.value)}/>
                  {errors.username && <div className='invalid-feedback'>{errors.username}</div>}
                </div>
                <div className='form-group mb-2'>
                  <label className='form-label'>Enter email:</label>
                  <input type='text' placeholder='' name='email' value={email} className={`form-control ${errors.email?'is-invalid':''}`}
                         onChange={(e)=> setEmail(e.target.value)}/>
                  {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                </div>
                <div className='form-group mb-2'>
                  <label className='form-label'>Enter password:</label>
                  <input type='password' placeholder='' name='password' value={password} className={`form-control ${errors.password?'is-invalid':''}`}
                         onChange={(e)=> setPassword(e.target.value)}/>
                  {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                </div>
                <button className='btn btn-success' onClick={savePerson}>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}

export default PersonComponent