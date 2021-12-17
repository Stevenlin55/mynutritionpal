import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from 'react-router-dom';
const EditFood = (props) => {

  const [name, setName] = useState("");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [date, setDate] = useState(new Date());

  //we will use this to reference the oldCalories and oldProtein values
  const oldCaloriesRef = useRef(0);
  const oldProteinRef = useRef(0);
  const oldDateRef = useRef(new Date());
  //get the id, totalCalories of Total object, and totalProtein of Total object from the passed in props
  const { state } = useLocation();
  const { id, totalCalories, totalProtein, totalObjectID } = state;

  const { user } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodData = () => {
      axios.get("https://mynutritionpal.herokuapp.com/foods/" + id)
        .then((res) => {
          setName(res.data.name);
          setCalories(res.data.calories);
          setProtein(res.data.protein);
          setDate(new Date(res.data.date));
          //after filling in the input forms with the data from the database, we will store the oldCalories and oldProtein values in the refs
          oldCaloriesRef.current = res.data.calories;
          oldProteinRef.current = res.data.protein;
          oldDateRef.current = new Date(res.data.date);
        });
      
    };
    fetchFoodData();
  }, [id]);

  function onSubmit(e) {
    e.preventDefault();

     //when we submit the form, we will first create a new food object with the updated values
     const food = {
      name,
      calories: calories,
      protein: protein,
      date: date,
    };

    //then we will update the foods object in the database with the new food object
    axios.post("https://mynutritionpal.herokuapp.com/foods/update/" + id, food).catch((error) => console.log(error));

    //if the user changed the date, we will update totals and food based on that change
    if (oldDateRef.current.getTime() !== date.getTime()) {
      updateTotalsOnDateChange();
    }else {
      updateTotalsIfDateDidNotChange();
    }

  }

  function updateTotalsOnDateChange() {
    //first update the total object from the database for the old date. 
    let totalObject = {
      calories: totalCalories - oldCaloriesRef.current,
      protein: totalProtein - oldProteinRef.current,
    };
    //update the total object in the database with the new total object
    axios.post('https://mynutritionpal.herokuapp.com/totals/update/' + totalObjectID, totalObject).then(()=> {
          //after editing food and updating the total for the old date, we will update the total object for the new date
          //first get the total object from the database for the new date by finding the right total object for the user
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
                    calories: calories,
                    protein: protein,
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
              totalObject.calories += parseInt(calories, 10);
              totalObject.protein += parseInt(protein, 10);
              //then update the total object in the database
              axios.post('https://mynutritionpal.herokuapp.com/totals/update/' + totalObjectID, totalObject).then(() => {
                    //after adding food and udpating total, return to previous page
                    navigate(-1)
              }).catch(error => console.log(error));
            }
          }).catch(error => console.log(error));
    }).catch(error => console.log(error));
  }

  function updateTotalsIfDateDidNotChange() {
      
    //calculate the new totalCalories and totalProtein values by finding the differences in values
    const caloriesDifference = parseInt(calories, 10) - oldCaloriesRef.current;
    const proteinDifference = parseInt(protein, 10) - oldProteinRef.current;

    //create a new total object with the new totalCalories and totalProtein values
    const totalObject = {
      calories: totalCalories + caloriesDifference,
      protein: totalProtein + proteinDifference,
    };


    //update the total object in the database with the new total object
    axios.post('https://mynutritionpal.herokuapp.com/totals/update/' + totalObjectID, totalObject).then(()=> {
          //after editing food and updating the total, return to home page
          navigate(-1)
    }).catch(error => console.log(error));
  }

  return (
    <div className="container">
      <h3 className="mt-4">Edit Food</h3>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-group mt-4">
          <label>Name: </label>
          <input
            type="text"
            required
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group mt-2">
          <label>Calories: </label>
          <input
            type="number"
            min="0"
            className="form-control"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </div>
        <div className="form-group mt-2">
          <label>Protein: </label>
          <input
            type="number"
            min="0"
            className="form-control"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </div>
        <div className="form-group mt-2">
          <label>Date: </label>
          <div>
            <DatePicker
              className="mb-4 border-4"
              selected={date}
              onChange={(date) => setDate(date)}
            />
          </div>
        </div>

        <div className="form-group">
          <input
            type="submit"
            value="Edit Food"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default EditFood;
