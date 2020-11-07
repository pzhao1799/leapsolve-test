//The context for basic session data, listens for authentication changes

import React from 'react';
import { withRouter } from 'react-router-dom';

import { withFirebase } from 'components/Firebase';

const DEFAULT_STATE = {
  uid: '',
  role: '',
  username: '',
  email: ''
};

const AuthContext = React.createContext(DEFAULT_STATE);

export const withAuthData = Component => props => (
  <AuthContext.Consumer>
    {({uid, role, username, email}) =>
      <Component {...props} uid={uid} role={role} username={username} email={email} />}
  </AuthContext.Consumer>
);

export const withAuth = Component => {
  class WithAuth extends React.Component {
    constructor(props) {
      super(props);

      this.state = { ...DEFAULT_STATE };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        user => {
          if(user) {
            this.props.firebase
              .userRef(user.uid)
              .once('value')
              .then((profile) => {
                this.setState({
                  uid: user.uid,
                  role: profile.val().role,
                  username: profile.val().username,
                  email: profile.val().email
                }, () => {
                  if(this.state.role === "solver") {
                    this.props.history.push("/solver/dashboard");
                  } else{
                    this.props.history.push("/user/dashboard");
                  }
                });
              });
          } else {
            this.setState({ ...DEFAULT_STATE });
          }
        }
      )
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthContext.Provider value={this.state}>
          <Component {...this.props} />
        </AuthContext.Provider>
      )
    }
  };
  return withRouter(withFirebase(WithAuth));
}

export default AuthContext;
