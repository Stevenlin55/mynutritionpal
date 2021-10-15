import React, { useState, useEffect, useRef } from "react";
// import {useForm} from "../useForm.js";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditFood = (props) => {
  // const [values, handleChange] = useForm({username: "", name: "", calories: 0, protein: 0, date: new Date()})
  const [users, setUsers] = useState(["test user", "Steven"]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [date, setDate] = useState(new Date());
  const userInput = useRef();

  useEffect(() => {
    const fetchFoodData = () => {
      axios
        .get("http://localhost:5000/foods/" + props.match.params.id)
        .then((res) => {
          setUsername(res.data.username);
          setName(res.data.name);
          setCalories(res.data.calories);
          setProtein(res.data.protein);
          setDate(new Date(res.data.date));
        });
      axios.get("http://localhost:5000/users/").then((res) => {
        if (res.data.length > 0) {
          setUsers(res.data.map((user) => user.username));
          setUsername(res.data[0].username);
        }
      });
    };
    fetchFoodData();
  }, [props.match.params.id]);

  function onSubmit(e) {
    e.preventDefault();

    const food = {
      username: username,
      name,
      calories: calories,
      protein: protein,
      date: date,
    };

    axios
      .post("http://localhost:5000/foods/update/" + props.match.params.id, food)
      .then((res) => console.log(res.data))
      .catch((error) => console.log(error));
    window.location = "/";
  }

  return (
    <div className="container">
      <h3>Edit Food Log</h3>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <label>Username: </label>
          <select
            ref={userInput}
            required
            className="form-control"
            value={username}
            onChange={() => setUsername("Stevenlin55")}
          >
            {users.map(function (user) {
              return (
                <option key={user} value={user}>
                  {user}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label>Name: </label>
          <input
            type="text"
            required
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Calories: </label>
          <input
            type="number"
            className="form-control"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Protein: </label>
          <input
            type="number"
            className="form-control"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker
              className="my-4 border-4"
              selected={date}
              onChange={(date) => setDate(date)}
            />
          </div>
        </div>

        <div className="form-group">
          <input
            type="submit"
            value="Edit Food Log"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default EditFood;
