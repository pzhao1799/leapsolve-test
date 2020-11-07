//The default protected page redirect for solvers

import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import AuthContext from 'components/Session';

function ProtectedRoute({ children, ...rest }) {
  return (
    <AuthContext.Consumer>
      {({role}) => (
        <Route {...rest}
          render={() =>
            ((role === "solver") ? (children)
            : (
              <Redirect to={{pathname:'/solver/landing/sign-in'}} />
            ))
          }
        />
      )}
    </AuthContext.Consumer>
  );
}

export default ProtectedRoute;
