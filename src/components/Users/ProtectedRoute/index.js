// The default protected page redirect for users

import React from "react";

import { Route, Redirect } from "react-router-dom";
import AuthContext from "components/Session";

function ProtectedRoute({ children, ...rest }) {
  return (
    <AuthContext.Consumer>
      {({ role }) => (
        <Route
          {...rest}
          render={() =>
            role === "user" ? (
              children
            ) : (
              <Redirect to={{ pathname: "/user/landing/sign-in" }} />
            )
          }
        />
      )}
    </AuthContext.Consumer>
  );
}

export default ProtectedRoute;
