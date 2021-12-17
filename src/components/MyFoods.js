import React, { useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../styles/myFoods.css'
const MyFoods = (props) => {

    const [foods, setFoods] = useState([]);
    const [name, setName] = useState("");
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [date, setDate] = useState("");
    const [foodID, setFoodID] = useState("");
    const [allTotals, setAllTotals] = useState([]);
    const [totalInfoForSelected, setTotalInfoForSelected] = useState({id: '', calories: 0, protein: 0});
    const { user } = props;

    useEffect(() => {
        // clean up controller when component unmounts. This prevents memory leaks
        let isSubscribed = true;
    
          //when page loads, get all foods and totals from database
            axios.get("https://mynutritionpal.herokuapp.com/foods/user/" + user)
            .then((res) => {
              if (isSubscribed) {
                  setFoods(res.data);
              }
            })
            .catch((error) => console.log(error));

            axios.get("https://mynutritionpal.herokuapp.com/totals/user/" + user)
            .then((res) => {
                if (isSubscribed) {
                    setAllTotals(res.data);
                }
            }).catch((error) => console.log(error));
        
          return () => {
            //clean up
            isSubscribed = false
            setFoods([]);
            
          };
          //dependency: user if user changes
      }, [user]); 
     
    //renders the list of foods created by the user
    function displayFoods() {
        //for each food, render it onto the div containing all foods
        return foods.map((food) => {
            return (
                <div className="food-div" key={food._id} tabIndex="0" onClick={()=> updateNutritionFacts(food._id, food.name, food.calories, food.protein, food.date)}>{food.name}</div>
            );
        });  
    }

    //when a food is clicked, this function will update the nutrition facts of the food
    function displayNutritionFacts() {
        return (
            <div className="nutrition-facts-body">
                <div className="flex overflow">
                    <p className="font-semibold mr-2">Name:</p> 
                    <p>{name}</p>
                </div>
                <p>Calories: {calories}</p>
                <p>Protein: {protein} g</p>
                <p>Date Added: {toCorrectDateFormat(date)}</p>
            </div>
        )
    }

    //when a food is clicked, we will render the date of the food in correct format 
    function toCorrectDateFormat(date) {
        if (date !== "") {
            //make edit and delete buttons appear
            document.getElementById('nutrition-facts-buttons').style.display = 'flex';
           //convert user selected date into a different format
            let dateObject = new Date(date);
            let month = dateObject.getMonth() + 1;
            let day = dateObject.getDate();
            let year = dateObject.getFullYear();
            return month + "/" + day + "/" + year;
        }
    }

    //each food has an onclick that if we click on a food, we will update the nutrition facts of the page 
    //and display the food's name, calories, protein, and creation date
    function updateNutritionFacts(id, name, calories, protein, date) {
        setFoodID(id);
        setName(name);
        setCalories(calories);
        setProtein(protein);
        setDate(date);
        getTotalForDate(date);
    }

    //finds the total object in database with the date that matches the date of the food
    function getTotalForDate(date) {
        
        //convert selected date into a different format
        let dateObject = new Date(date);
        let selectedDate = new Date(
            dateObject.getFullYear(),
            dateObject.getMonth(),
            dateObject.getDate()
        ); 
        //filter totals by date and return an array of totals that are of the same date as the selected date
        let total = allTotals.filter((total) => {
            //filter every total by date
            let totalDate = new Date(total.date); //convert the MongoDB ISON date format into javascript date format
            var formattedTotalDate = new Date(
              totalDate.getFullYear(),
              totalDate.getMonth(),
              totalDate.getDate()
            ); 
            return formattedTotalDate.toString() === selectedDate.toString(); //returns array after formatting to string
           });
           setTotalInfoForSelected({id:total[0]._id, calories: total[0].calories, protein: total[0].protein});
    }

  //when user clicks on delete button, delete food from database
  function deleteFood() {
    axios.delete("https://mynutritionpal.herokuapp.com/foods/" + foodID).catch((error) => console.log(error));
    //after deleting food, update totals by first getting the Total object from the database. the total id is accessed from hook
    let totalObject = null;
    axios.get('https://mynutritionpal.herokuapp.com/totals/' + totalInfoForSelected.id).then(res => {
      totalObject = res.data;
      //then update the totals by subtracting the calories and protein from the food deleted
      totalObject.calories -= calories;
      totalObject.protein -= protein;
      //then update the total object in the database
      axios.post('https://mynutritionpal.herokuapp.com/totals/update/' + totalInfoForSelected.id, totalObject)
        .then(() => {
           //get rid of the food deleted from the foods array
              let updatedFoodList = foods.filter((food) => {
                return food._id !== foodID;
              });
            //update the foods array
            setFoods(updatedFoodList);
            //update nutrition facts to default values
            setName("");
            setCalories(0);
            setProtein(0);
            setDate("");
        })
        .catch(error => console.log(error));

    }).catch(error => console.log(error));

  }



    return (
        <div className="w-5/6 sm:w-3/5 m-auto h-72">
            <div className="header flex justify-between mt-7 border-b">
             <h4 className="text-blue-800 text-lg sm:text-xl">Your Personal Foods</h4>
             <Link to="/add"><button className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-1 px-2 rounded mb-2">Add Food</button></Link>
            </div>      
            <div className="flex flex-col sm:flex-row mt-5 sm:h-full sm:justify-between">
                <div className="foods-div border-2 border-gray-500 w-full max-h-48 sm:w-6/12 sm:h-full sm:max-h-full overflow-y-scroll">
                    {displayFoods()}
                </div>
                <div className="nutrition-facts sm:w-5/12">
                    <div className="nutrition-facts-header flex flex-col lg:flex-row sm:justify-between items-center mb-3">
                        <h5 className="text-base sm:text-lg nutrition-facts-text">Nutrition Facts</h5>
                        <div className="flex justify-between w-full md:w-28 lg:w-32 2xl:w-32" id="nutrition-facts-buttons">
                            {/* edit button below */}
                            <Link to={"/edit/" + foodID} state={{ id: foodID, totalProtein: totalInfoForSelected.protein, totalCalories: totalInfoForSelected.calories, totalObjectID: totalInfoForSelected.id }}>
                                <button className="bg-green-600 hover:bg-green-700 text-white py-0.5 px-2 text-sm sm:text-base rounded border-transparent border-1">Edit</button>
                            </Link>
                             {/* delete button below */}
                            <button 
                                className="bg-gray-100 hover:bg-gray-200  border-black border-1 py-0.5 px-2 text-sm sm:text-base rounded"
                                onClick={() => deleteFood()}>
                                Delete
                            </button>
                        </div>
                        
                    </div>
                    {displayNutritionFacts()}
                </div>
            </div>
        </div>
    );
};

export default MyFoods;