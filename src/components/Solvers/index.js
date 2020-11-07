// Top-level routes for the solver site

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Landing from "./Landing/LandingPage";
import Account from "./Account";
import Problem from "./Problem";
import Verification from "./Problem/Verification";
import SignUp from "../Common/SignUp/SignUp";
import SignIn from "../Common/SignIn/SignInForm";
import Confirm from "./Landing/Confirm";
import Layout from "./Layout";

class Solver extends Component {
  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/solver/landing/register">
            <SignUp role="solver" />
          </Route>
          <Route path="/solver/landing/sign-in">
            <SignIn role="solver" />
          </Route>
          <Route path="/solver/landing/confirm">
            <Confirm />
          </Route>

          <ProtectedRoute path="/solver/dashboard">
            <Dashboard />
          </ProtectedRoute>
          <ProtectedRoute path="/solver/account">
            <Account />
          </ProtectedRoute>
          <ProtectedRoute path="/solver/problem">
            <Problem />
          </ProtectedRoute>
          <ProtectedRoute path="/solver/verification">
            <Verification />
          </ProtectedRoute>

          <Route path="/solver">
            <Landing />
          </Route>
        </Switch>
      </Layout>
    );
  }
}
export default Solver;
