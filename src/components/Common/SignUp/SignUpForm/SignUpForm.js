// Registration form for users

import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  EuiButton,
  EuiFieldPassword,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
} from "@elastic/eui";

import { withFirebase } from "components/Firebase";

const BLANK_STATE = {
  username: "",
  email: "",
  password: "",
  passwordCheck: "",
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...BLANK_STATE, role: props.role };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    const { username, email, password } = this.state;

    this.props.firebase
      .doRegisterUser(email, password, username, this.state.role)
      .then(() => {
        this.setState({ ...BLANK_STATE });
        this.props.history.push("/user/landing/confirm");
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { username, email, password, passwordCheck, error } = this.state;

    const errors = error ? [error.message] : [];
    const invalid =
      username === "" ||
      email === "" ||
      password === "" ||
      password !== passwordCheck;

    return (
      <EuiForm
        component="form"
        onSubmit={this.onSubmit}
        isInvalid={errors.length > 0}
        error={errors}
        className="form"
      >
        <EuiFormRow label="Name" helpText="Your solvers will see this.">
          <EuiFieldText
            name="username"
            value={username}
            onChange={this.onChange}
          />
        </EuiFormRow>
        <EuiFormRow label="Email">
          <EuiFieldText name="email" value={email} onChange={this.onChange} />
        </EuiFormRow>
        <EuiFormRow
          label="Password"
          helpText="Password should be at least 6 characters long"
        >
          <EuiFieldPassword
            name="password"
            value={password}
            onChange={this.onChange}
          />
        </EuiFormRow>
        <EuiFormRow label="Confirm Password">
          <EuiFieldPassword
            name="passwordCheck"
            value={passwordCheck}
            onChange={this.onChange}
            isInvalid={passwordCheck !== "" && passwordCheck !== password}
          />
        </EuiFormRow>
        <EuiButton type="submit" fill disabled={invalid}>
          Register
        </EuiButton>
        <EuiSpacer size="l" />
        <Link to={`/${this.state.role}/landing/sign-in`}>
          Already have an account?
        </Link>
      </EuiForm>
    );
  }
}

export default withRouter(withFirebase(SignUpForm));
