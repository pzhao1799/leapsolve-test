// Password Change form

import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";
import {
  EuiButton,
  EuiForm,
  EuiFormRow,
  EuiFieldPassword,
  EuiSpacer,
} from "@elastic/eui";

const BLANK_STATE = {
  oldPassword: "",
  newPassword: "",
  passwordCheck: "",
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...BLANK_STATE };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    const email = this.props.email;
    this.props.firebase
      .doReauthenticate(email, this.state.oldPassword)
      .then(
        this.props.firebase
          .doPasswordUpdate(this.state.newPassword)
          .then(() => {
            this.setState({ ...BLANK_STATE });
          })
          .catch((error) => {
            this.setState({ error });
          })
      )
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { oldPassword, newPassword, passwordCheck, error } = this.state;

    const invalid = newPassword !== passwordCheck;

    return (
      <EuiForm component="form" onSubmit={this.onSubmit}>
        <EuiFormRow label="Old Password">
          <EuiFieldPassword
            name="oldPassword"
            value={oldPassword}
            onChange={this.onChange}
          />
        </EuiFormRow>
        <EuiFormRow label="New Password">
          <EuiFieldPassword
            name="newPassword"
            value={newPassword}
            onChange={this.onChange}
          />
        </EuiFormRow>
        <EuiFormRow label="Re-type Password">
          <EuiFieldPassword
            name="passwordCheck"
            value={passwordCheck}
            onChange={this.onChange}
          />
        </EuiFormRow>
        <EuiButton type="submit" fill disabled={invalid}>
          Change Password
        </EuiButton>
        <EuiSpacer size="l" />
        {error && <p>{error.message}</p>}
      </EuiForm>
    );
  }
}

export default withAuthData(withRouter(withFirebase(PasswordChangeForm)));
