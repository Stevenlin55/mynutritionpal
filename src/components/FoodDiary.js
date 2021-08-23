import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCaretSquareLeft, FaCaretSquareRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Food from "./Food.js";
import "react-datepicker/dist/react-datepicker.css";
import QuickAddModal from "./QuickAddModal.js";

const FoodDiary = () => {
  const [foods, setFoods] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    axios
      .get("http://localhost:5000/foods/")
      .then((res) => {
        setFoods(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  function decreaseDate() {
    let currentDate = date;
    //subtract a day from the date
    currentDate.setDate(currentDate.getDate() - 1);
    setDate(currentDate);
  }

  function increaseDate() {
    let currentDate = date;
    //add a day to the date
    currentDate.setDate(currentDate.getDate() + 1);
    setDate(currentDate);
  }
  function deleteFood(id) {
    axios
      .delete("http://localhost:5000/foods/" + id)
      .then((res) => {
        console.log(res.data, " is deleted");
      })
      .catch((error) => console.log(error));

    setFoods(foods.filter((food) => food._id !== id));
  }

  function createFoodList() {
    let selectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ); //converts the user selected date into a different format
    let foodList = foods.filter((food) => {
      //filter every food by date
      let foodDate = new Date(food.date); //convert the MongoDB ISON date format into javascript date format
      var formattedFoodDate = new Date(
        foodDate.getFullYear(),
        foodDate.getMonth(),
        foodDate.getDate()
      ); //converts javascript date format to different format
      return formattedFoodDate.toString() === selectedDate.toString(); //returns array after formatting to string
    });

    return foodList.map((currentFood) => {
      //returns all food for the selected date
      return (
        <Food
          food={currentFood}
          deleteFood={deleteFood}
          key={currentFood._id}
        />
      );
    });
  }

  return (
    <div className="container my-8">
      <div className="flex items-center justify-center">
        <div>Your Food Diary For:</div>
        <div className="flex">
          <FaCaretSquareLeft
            size={30}
            color={"blue"}
            className="cursor-pointer -mr-px"
            onClick={() => decreaseDate()}
          />
          <DatePicker
            className="flex items-center justify-center bg-blue-600 rounded-sm h-6 mt-0.5 text-white px-4 py-1"
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="EEEE, MMMM d, yyyy"
          />
          <FaCaretSquareRight
            size={30}
            color={"blue"}
            className="cursor-pointer -ml-px"
            onClick={() => increaseDate()}
          />
        </div>
      </div>

      <div className="mt-5">
        <table className="mx-auto w-3/4 border-collapse">
          <thead>
            <tr>
              <th className="w-8/12"></th>
              <th className="border border-white bg-blue-600 text-center text-white">
                Calories (kcal)
              </th>
              <th className="border border-white bg-blue-600 text-center text-white">
                Protein (g)
              </th>
            </tr>
          </thead>
          <tbody>{createFoodList()}</tbody>
          <tbody>
            <tr>
              <td>
                <Link className="" to={"/create"}>
                  Add Food
                </Link>{" | "}
                <div className="inline-block cursor-pointer">Quick Add</div>
              </td>
            </tr>
          </tbody>
        </table>
        <QuickAddModal />
      </div>
    </div>
  );
};

export default FoodDiary;
