import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Food = props => (
    <tr>
      <td>{props.food.username}</td>
      <td>{props.food.name}</td>
      <td>{props.food.calories}</td>
      <td>{props.food.protein}</td>
      <td>
        <Link to={"/edit/"+props.food._id}>edit</Link> | <a href="#" onClick={() => { props.deleteFood(props.food._id) }}>delete</a>
      </td>
    </tr>
  )

const FoodDiary = () => {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/foods/')
          .then(res => {
            setFoods(res.data)
          }).catch(error => console.log(error));
      },[]);

    function deleteFood(id) {
        axios.delete('http://localhost:5000/foods/'+id)
            .then(res => {
                console.log(res.data, " is deleted");
            })
            .catch(error => console.log(error));
        
        setFoods(foods.filter(food => food._id !== id));
    }

    function foodList() {
        return foods.map(currentFood => {
          return <Food food={currentFood} deleteFood={deleteFood} key={currentFood._id}/>;
        })
    }

    return (
        <div className="container">
        <h3>Logged Foods</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Calories</th>
              <th>Protein</th>
            </tr>
          </thead>
          <tbody>
            { foodList() }
          </tbody>
        </table>
        </div>
    );
};

export default FoodDiary;