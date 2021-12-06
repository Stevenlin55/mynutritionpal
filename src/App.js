import React, {Fragment, useState, useEffect} from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import './styles/App.css';
import Navbar from "./components/Navbar.js";

import FoodDiary from "./components/FoodDiary.js";
import EditFood from "./components/EditFood.js";
import AddFood from "./components/AddFood.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";

import GuardedRoute from "./GuardedRoute.js";
import MyFoods from "./components/MyFoods";


export default function App() {
  const [user , setUser] = useState({});
  const [loading, setLoading] = useState(true);

  //when page renders, check if user is logged in by checking local storage
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setUser(localStorage.getItem('token'));
    }
    //after checking local storage, set loading to false to show page
    setLoading(false);
  }, []);
  
  //we first show a spinner from BootStrap that indicates loading until we know if the user is logged in or not
  if (loading) {
    return (
      <div id="loading-page">
        <div className="spinner-border text-primary" id="spinner" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    //when we know if the user is logged in or not, we render the app
    return (
      <div>
        <Router >
          <Fragment>
          {/* render navbar here */}
          <Navbar user={user}/>
  
          {/* all routes are below */}
          <Routes>
            {/* we have a route that is private to authenticated users only. This means that 
                only logged in users have accesses to these routes                       */}
            <Route path="/" element={<GuardedRoute user={user} />} >
              <Route path="/" element={<FoodDiary user={user} />} />
              <Route path="/edit/:id" element={<EditFood user={user} />} />
              <Route path="/add" element={<AddFood user={user} />} />
              <Route path="/myfoods" element={<MyFoods user={user} />} />
            </Route>
            
  
            {/* The routes below are accessed only when user is not logged in */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
  
        </Fragment>
      </Router>
      </div>
    );
  }
    
}
