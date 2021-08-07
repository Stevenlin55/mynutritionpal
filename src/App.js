import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/Navbar.js";

import FoodDiary from "./components/FoodDiary.js";
import EditFood from "./components/EditFood.js";
import CreateFood from "./components/CreateFood.js";
import CreateUser from "./components/CreateUser.js";

export default function App() {
  return (
    <Router>
      <div>
      <Navbar />
      <Route path="/" exact component={FoodDiary} />
      <Route path="/edit/:id" component={EditFood} />
      <Route path="/create" component={CreateFood} />
      <Route path="/user" component={CreateUser} />
      </div>
      
    </Router>
  );
}
