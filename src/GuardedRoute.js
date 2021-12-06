//code below is from https://stackoverflow.com/questions/69864165/error-privateroute-is-not-a-route-component-all-component-children-of-rou

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const GuardedRoute = (props) => {
  //code below destructure props
  const { component: Component, user, ...rest } = props;

  //user is an object and we can check if object is empty using code below
  //if user is not empty, then we will redirect to main page
  if (Object.keys(user).length !== 0) {
    return <Outlet {...rest} />;
  } else { //if user is empty, then we will redirect to login page
    return <Navigate to="/login" />;
  }

}

export default GuardedRoute;