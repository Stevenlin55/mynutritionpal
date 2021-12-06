import React from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

//this Food component will contain the name of the food along with edit+delete buttons for each food
const Food = (props) => (
  <tr className="bg-gray-200">
 
    <td className="border border-white group">
      {props.food.name}{" "}
      <Link to={"/edit/" + props.food._id} state={{ id: props.food._id, totalProtein: props.totals.protein, totalCalories: props.totals.calories, totalObjectID: props.totals.id }}>
        <FaPencilAlt className="inline text-gray-200 group-hover:text-blue-800 mr-5" />
      </Link>
      <FaTrash
        onClick={() => {
          props.deleteFood(props.food._id, props.food.calories, props.food.protein);
        }}
        className="cursor-pointer inline text-gray-200 group-hover:text-blue-800"
      />
    </td>
    <td className="border border-white text-center">{props.food.calories}</td>
    <td className="border border-white text-center">{props.food.protein}</td>
  </tr>
);

export default Food;
