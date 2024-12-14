// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {listUsers} from "../services/UserService.js";
import {useNavigate} from "react-router-dom";

function ListPersonComponent(){

    const [people, setPeople] = useState([])

    const navigator = useNavigate();

    useEffect(() => {
        listUsers().then((response)=>{
            setPeople(response.data)
        }).catch(error => {
            console.error(error)
        })
    }, []);

    function addNewPerson() {
        navigator('/register')
    }

    function updatePerson(id) {
        navigator(`/edit-person/${id}`)

    }

    return(
        <div className="container">

            <h2 className="text-center">List of Person</h2>
            <button className="btn btn-primary" onClick={addNewPerson}>Add person</button>
            <table className="table">
                <thead>
                <tr>
                    <th>Person ID</th>
                    <th>Person Username</th>
                    <th>Person Email</th>
                    <th>Person Password</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    people.map(person=>
                    <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{person.username}</td>
                        <td>{person.password}</td>
                        <td>{person.email}</td>
                        <td>
                            <button className='btn btn-info' onClick={() => updatePerson(person.id)}>Update</button>
                        </td>
                    </tr>)
                }
                </tbody>
            </table>
        </div>
    )
}

export default ListPersonComponent