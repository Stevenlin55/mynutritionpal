import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCaretSquareLeft, FaCaretSquareRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Food from "./Food.js";
import "react-datepicker/dist/react-datepicker.css";
import QuickAddModal from "./QuickAddModal.js";
import '../styles/foodDiary.css';
import TotalsTable from "./TotalsTable.js";
const FoodDiary = (props) => {

  const [foodToShow, setFoodToShow] = useState([]);
  const [date, setDate] = useState(new Date());
  const [totals, setTotals] = useState({id: '', calories: 0, protein: 0});
  const { user } = props;

  useEffect(() => {
    // clean up controller when component unmounts. This prevents memory leaks
    let isSubscribed = true;

      //when page loads, get all foods and totals from database
        axios.get("https://mynutritionpal.herokuapp.com/foods/user/" + user)
        .then((res) => {
          if (isSubscribed) {
            let allFood = res.data;
            //after getting all food, update the list of foods and total calories and protein 
            updateFoodList(date, allFood, user);
          }
        })
        .catch((error) => console.log(error));
    
      return () => {
        //clean up
        isSubscribed = false
        setFoodToShow([]);
        
      };
      //dependency: date because we want to update page whenever the selected date changes. useEffect is called when date changes
  }, [date, user]); 
 
  //whenever user goes back a day, update the date
  function decreaseDate() {
    let currentDate = date;
    //subtract a day from the date
    let newDate = currentDate.setDate(currentDate.getDate() - 1);
    setDate(new Date(newDate));
  }
  //whenever user goes forward a day, update the date
  function increaseDate() {
    let currentDate = date;
    //add a day to the date
    let newDate = currentDate.setDate(currentDate.getDate() + 1);
    setDate(new Date(newDate));
  }

  //when user clicks on trashcan icon on food, delete food from database
  function deleteFood(id, calories, protein) {
    axios.delete("https://mynutritionpal.herokuapp.com/foods/" + id).catch((error) => console.log(error));
    //after deleting food, update totals by first getting the Total object from the database
    let totalObject = null;
    axios.get('https://mynutritionpal.herokuapp.com/totals/' + localStorage.getItem('totalID')).then(res => {
      totalObject = res.data;
      //then update the totals by subtracting the calories and protein from the food deleted
      totalObject.calories -= calories;
      totalObject.protein -= protein;
      //then update the total object in the database
      axios.post('https://mynutritionpal.herokuapp.com/totals/update/' + localStorage.getItem('totalID'), totalObject)
        .then(() => {
           //remove food from foods displayed state and update the frontend
            let newList = foodToShow.filter((food) => food._id !== id);
            setFoodToShow(newList);
        })
        .catch(error => console.log(error));

    }).catch(error => console.log(error));

  }

  //this is called when page is rendered. It will update the list of foods and choose which foods to display
  function updateFoodList(date, allFood, user) {
    
    //convert user selected date into a different format
    let selectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ); 

    //filter food by date and return an array of foods that are of the same date as the selected date
    let foodList = allFood.filter((food) => {
      //filter every food by date
      let foodDate = new Date(food.date); //convert the MongoDB ISON date format into javascript date format
      var formattedFoodDate = new Date(
        foodDate.getFullYear(),
        foodDate.getMonth(),
        foodDate.getDate()
      ); 
      return formattedFoodDate.toString() === selectedDate.toString(); //returns array after formatting to string
    });

    //set foods to show to the filtered array
    setFoodToShow(foodList);
    return foodList;
  }

  //whenever page is rendered, display the food for the selected day
  function displayFood() {
    //get the food we want to display from the state
    let foodList = foodToShow;
    //display the food by mapping all items in the food list to a Food component
    return foodList.map((currentFood) => {
      //returns all food for the selected date
      return (
        //each food is a component that is rendered
        <Food
          food={currentFood}
          deleteFood={deleteFood}
          key={currentFood._id}
          totals={totals}
        />
      );
    });
  }

  return (
    <div className="container my-8">
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <div className="text-base">Your Food Diary For:</div>
        <div className="flex ml-3 datepicker-arrows">
          {/* left arrow icon that allows user to go back one day */}
          <FaCaretSquareLeft
            size={30}
            color={"blue"}
            className="cursor-pointer"
           
            id="left-arrow"
            onClick={() => decreaseDate()}
          />
          {/* bar between arrows with the current selected date */}
          <DatePicker
            className="flex items-center justify-center bg-blue-600 rounded-sm mt-0.5 text-white text-base"
            selected={date}
            onChange={(date) => setDate(date)}
            id="date-picker"
            dateFormat="EEEE, MMMM d"
          />
          {/* right arrow icon that allows user to go back one day */}
          <FaCaretSquareRight
            size={30}
            color={"blue"}
            className="cursor-pointer"
            id="right-arrow"
            onClick={() => increaseDate()}
          />
        </div>
      </div>

    {/* div below is the table with containing food, calories, protein */}
      <div className="mt-5">
        <table className="mx-auto w-4/5 sm:w-3/4 border-collapse">
          <thead>
            <tr>
              <th className="w-10/12 sm:w-8/12"></th>
              <th className="text-sm sm:text-base border border-white bg-blue-600 text-center text-white">
                Calories (kcal)
              </th>
              <th className="text-sm sm:text-base border border-white bg-blue-600 text-center text-white">
                Protein (g)
              </th>
            </tr>
          </thead>
          {/* body of table holds all of the food. the method displayFood() handles the mapping from array to the row, and the Food component handles styling*/}
          <tbody>{displayFood()}</tbody>
          <tbody>
          {/* row below is the Add Food | Quick Add links. This row has padding bottom to create space between next row  */}
            <tr className="spaceUnder">
              <td className="w-5"> 
                <Link className="smaller-text text-sm sm:text-base mr-2 text-blue-600 font-semibold no-underline" to={"/add"}  state={{ date }}>Add Food</Link>
                {"  |  "}
                <QuickAddModal setTotals={setTotals} totalCalories={totals.calories} totalProtein={totals.protein}/>
              </td>
            </tr>
           <TotalsTable food={foodToShow} date={date} user={user} setTotals={setTotals} totalCalories={totals.calories} totalProtein={totals.protein}/>
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default FoodDiary;
