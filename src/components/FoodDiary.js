import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCaretSquareLeft, FaCaretSquareRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Food = (props) => (
  <tr>
    <td>{props.food.username}</td>
    <td>{props.food.name}</td>
    <td>{props.food.calories}</td>
    <td>{props.food.protein}</td>
    <td>
      <Link to={"/edit/" + props.food._id}>edit</Link> |{" "}
      <a
        href="#"
        onClick={() => {
          props.deleteFood(props.food._id);
        }}
      >
        delete
      </a>
    </td>
  </tr>
);

const FoodDiary = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/foods/")
      .then((res) => {
        setFoods(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  function deleteFood(id) {
    axios
      .delete("http://localhost:5000/foods/" + id)
      .then((res) => {
        console.log(res.data, " is deleted");
      })
      .catch((error) => console.log(error));

    setFoods(foods.filter((food) => food._id !== id));
  }

  function foodList() {
    return foods.map((currentFood) => {
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
          <FaCaretSquareLeft size={30} color={"blue"} className="-mr-px" />
          <div className="flex items-center justify-center bg-blue-600 rounded-sm h-6 mt-0.5 text-white px-4 py-1">
            Tuesday, July 21, 2021
          </div>
          <FaCaretSquareRight size={30} color={"blue"} className="-ml-px" />
        </div>
      </div>

      <div className="mt-5">
        <table className="mx-auto w-3/4 border-collapse">
          <thead>
            <tr>
              <th className="w-8/12"></th>
              <th className="border border-gray-600 bg-blue-600 text-center text-white">Calories (kcal)</th>
              <th className=" border border-gray-600 bg-blue-600 text-center text-white">Protein (g)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-200 ">
              <td className="border border-gray-600">Chicken Fried Rice from chinese restaurant</td>
              <td className="border border-gray-600 text-center">400</td>
              <td className="border border-gray-600 text-center">40</td>
            </tr>
            <tr className="bg-gray-200">
              <td className="border border-gray-600">
                Egg Tart
              </td>
              <td className="border border-gray-300 text-center">200</td>
              <td className="border border-gray-300 text-center">1</td>
            </tr>
          </tbody>
        </table>
      </div>

      
        <div className="">
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
    </div>
  );
};

export default FoodDiary;
