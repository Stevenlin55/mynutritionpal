import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCaretSquareLeft, FaCaretSquareRight, FaPencilAlt, FaTrash} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//food component that is created in createFoodList()
const Food = (props) => (
  <tr className="bg-gray-200">
    {/* <td className="border border-white">{props.food.username}</td> you can get username from props*/} 
    
    <td className="border border-white group">
      {props.food.name} <Link to={"/edit/" + props.food._id}><FaPencilAlt className="inline text-gray-200 group-hover:text-blue-800 mr-5"/></Link>
      <a
        href="#"
        onClick={() => {
          props.deleteFood(props.food._id);
        }}
      >
        <FaTrash className="inline text-gray-200 group-hover:text-blue-800"/>
      </a>
    </td>
    <td className="border border-white text-center">{props.food.calories}</td>
    <td className="border border-white text-center">{props.food.protein}</td>
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

  function createFoodList() {
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
              <th className="border border-white bg-blue-600 text-center text-white">Calories (kcal)</th>
              <th className="border border-white bg-blue-600 text-center text-white">Protein (g)</th>
            </tr>
          </thead>
          <tbody>{createFoodList()}</tbody>
          <Link to={"/create"}>Add Food</Link>
        </table>
        
      </div>
    </div>
  );
};

export default FoodDiary;
