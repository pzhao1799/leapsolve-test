// Form for users to sign in
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { withFirebase } from "components/Firebase";
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiSpacer,
  EuiTitle,
  EuiButton,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiFieldPassword,
} from "@elastic/eui";

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: null,
      role: props.role,
    };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .catch((error) => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;
    const invalid = email === "" || password === "";

    const errors = error ? [error.message] : [];
    return (
      <EuiPage restrictWidth>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l" id="landing-header">
                <h1>Log in</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent
            horizontalPosition="center"
            style={{ border: "1px solid #9170B8" }}
            className="borderless"
          >
            <EuiForm
              component="form"
              onSubmit={this.onSubmit}
              className="form"
              isInvalid={errors.length > 0}
              error={errors}
            >
              <EuiFormRow label="Email">
                <EuiFieldText
                  name="email"
                  value={email}
                  onChange={this.onChange}
                />
              </EuiFormRow>
              <EuiFormRow label="Password">
                <EuiFieldPassword
                  name="password"
                  value={password}
                  onChange={this.onChange}
                />
              </EuiFormRow>
              <EuiButton type="submit" fill disabled={invalid}>
                Log in
              </EuiButton>
              <EuiSpacer size="l" />
              {error && <p>{error.message}</p>}
            </EuiForm>

            <EuiSpacer size="s" />
            <Link to={`/${this.props.role}/landing/register`}>
              Need to make an account?
            </Link>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export default withRouter(withFirebase(SignIn));
