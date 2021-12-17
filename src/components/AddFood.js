import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from 'react-router-dom';

const AddFood = (props) => {
    const [name, setName] = useState("");
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [date, setDate] = useState(new Date());

    //get the selected date passed in from state in the parent component
    const { state } = useLocation();
    const navigate = useNavigate();
  
    //useEffect to prevent infinite loop when setting the date if state exists
    useEffect(() => {
        //there would only be a state if the user accesses this page from FoodDiary. Otherwise, they accessed it 
        //from MyFoods or URL
        if (state) {
          setDate(state.date);
        }

    }, [state])
    
    const { user } = props;

    function onSubmit(e) {
        e.preventDefault();

        //create new food object to send to database with the information for the input fields that are stored in state
        const food = {
            userID: user,
            name,
            calories: calories,
            protein: protein,
            date: date
        }
        
        //add the new food object to the database
        axios.post('https://mynutritionpal.herokuapp.com/foods/add', food).catch(error => console.log(error));
        
        //we now have to update the total object in the database with the new food object's values
        //first get the total object from the database for the user
        let totalObject = null; 
       
        axios.get('https://mynutritionpal.herokuapp.com/totals/user/' + user).then(res => {
          
            //convert selected date into a different format
            let selectedDate = new Date(
             date.getFullYear(),
             date.getMonth(),
             date.getDate()
           ); 
         
           //filter totals by date and return an array of totals that are of the same date as the selected date
           let total = res.data.filter((total) => {
             //filter every food by date
             let totalDate = new Date(total.date); //convert the MongoDB ISON date format into javascript date format
             var formattedTotalDate = new Date(
               totalDate.getFullYear(),
               totalDate.getMonth(),
               totalDate.getDate()
             ); 
             return formattedTotalDate.toString() === selectedDate.toString(); //returns array after formatting to string
            });
            let totalObjectID;
           //if the total array is empty, then we need to create a new total object for that date
            if (total.length === 0) {
                totalObject = {
                    userID: user,
                    calories: food.calories,
                    protein: food.protein,
                    date: date
                }
                //add the new total object to the database and then return to previous page
                axios.post('https://mynutritionpal.herokuapp.com/totals/add', totalObject).then(() =>  navigate(-1)).catch(error => console.log(error));
            }else { //if the total array is not empty, then we need to update the local object holding the totals
              totalObject = {
                calories: total[0].calories,
                protein: total[0].protein,
              }
              //get the total object ID from the database that we will use for endpoint
              totalObjectID = total[0]._id;
              //update the total object to include the new food object's values
              totalObject.calories += parseInt(food.calories, 10);
              totalObject.protein += parseInt(food.protein, 10);
              //then update the total object in the database
              axios.post('https://mynutritionpal.herokuapp.com/totals/update/' + totalObjectID, totalObject).then(() => {
                    //after adding food and udpating total, return to previous page
                    navigate(-1)
              }).catch(error => console.log(error));
            }
          }).catch(error => console.log(error));
    };

    return (
        <div className="container">
        <h3 className="mt-4" >Add Food</h3>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group mt-4"> 
            <label>Name: </label>
            <input  type="text"
                required
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                />
          </div>
          <div className="form-group mt-2">
            <label>Calories: </label>
            <input 
                type="number" 
                min="0"
                className="form-control"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                />
          </div>
          <div className="form-group mt-2">
            <label>Protein: </label>
            <input 
                type="number" 
                min="0"
                className="form-control"
                value={protein}
                onChange={e => setProtein(e.target.value)}
                />
          </div>
          <div className="form-group mt-2">
            <label>Date: </label>
            <div>
              <DatePicker
                className="mb-4 border-4"
                selected={date}
                onChange={date => setDate(date)}
              />
            </div>
          </div>
  
          <div className="form-group">
            <input type="submit" value="Add Food" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
};

export default AddFood;