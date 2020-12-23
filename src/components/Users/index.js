// Top-level routes for the user site

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Landing from "./Landing/LandingPage";
import Account from "./Account";
import { QuestionPage } from "./Questions";
import SignUp from "../Common/SignUp/SignUp";
import SignIn from "../Common/SignIn/SignInForm";
import Confirm from "./Landing/Confirm";
import Layout from "./Layout";
import Verification from "./Questions/Verification";
import NewQuestion from "./NewQuestion";

class User extends Component {
  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/user/landing/register">
            <SignUp role="user" />
          </Route>
          <Route path="/user/landing/sign-in">
            <SignIn role="user" />
          </Route>
          <Route path="/user/landing/confirm">
            <Confirm />
          </Route>

          <ProtectedRoute path="/user/dashboard">
            <Dashboard />
          </ProtectedRoute>
          <ProtectedRoute path="/user/account">
            <Account />
          </ProtectedRoute>
          <ProtectedRoute path="/user/questions">
            <QuestionPage />
          </ProtectedRoute>
          <ProtectedRoute path="/user/verification">
            <Verification />
          </ProtectedRoute>
          <ProtectedRoute path="/user/newquestion">
            <NewQuestion />
          </ProtectedRoute>

          <Route path="/user/">
            <Landing />
          </Route>
        </Switch>
      </Layout>
    );
  }
}
export default User;
