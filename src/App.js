import React, { useState, useReducer } from "react";

import { UserContext } from "context/UserContext";
import reducer from "./context/reducer";
import { SET_USER, SET_TICKET } from "./context/action.types";
import Signin from "views/Signin";
import Signup from "views/Signup";
import AdminLayout from "layouts/Admin.js";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "assets/css/login.css";
import "react-toastify/dist/ReactToastify.css";
import "react-perfect-scrollbar/dist/css/styles.css";

//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import firebaseConfig from "config/firebaseConfig";

//init firebase
firebase.initializeApp(firebaseConfig);

const initialState = {
  tickets: [],
  ticket: {},
  ticketToUpdate: null,
  ticketToUpdateKey: null,
  user: null,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <BrowserRouter>
      <ToastContainer />
      <UserContext.Provider value={{ state, dispatch }}>
        <Switch>
          <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
          <Route exact path="/signin" component={Signin} />
          <Route exaxt path="/signup" component={Signup} />
          <Redirect to="/signin" />
        </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
