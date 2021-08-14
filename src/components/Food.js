import React from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Food = (props) => (
  <tr className="bg-gray-200">
    {/* <td className="border border-white">{props.food.username}</td> you can get username from props and also date*/}

    <td className="border border-white group">
      {props.food.name}{" "}
      <Link to={"/edit/" + props.food._id}>
        <FaPencilAlt className="inline text-gray-200 group-hover:text-blue-800 mr-5" />
      </Link>
      <FaTrash
        onClick={() => {
          props.deleteFood(props.food._id);
        }}
        className="cursor-pointer inline text-gray-200 group-hover:text-blue-800"
      />
    </td>
    <td className="border border-white text-center">{props.food.calories}</td>
    <td className="border border-white text-center">{props.food.protein}</td>
  </tr>
);

export default Food;
