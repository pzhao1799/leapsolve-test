// Profile Description form for Solvers
import React, { Component } from "react";
import {
  EuiButton,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiTextArea,
} from "@elastic/eui";
import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";

const BLANK_STATE = { profile: "", error: null };

class ContactForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...BLANK_STATE };
  }

  componentDidMount() {
    this.props.firebase
      .doGetProfileDescription()
      .then((result) => this.setState({ profile: result.val().description }));
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();

    this.props.firebase
      .doSetProfileDescription(this.state.profile)
      .catch((error) => {
        this.setState({ error });
      });
  };

  render() {
    const { profile, error } = this.state;

    return (
      <EuiForm
        component="form"
        onSubmit={this.onSubmit}
        isInvalid={error}
        error={error?.message}
      >
        <EuiFormRow>
          <EuiTextArea
            name="profile"
            value={profile}
            onChange={this.onChange}
          />
        </EuiFormRow>
        <EuiButton type="submit" fill>
          Save Changes
        </EuiButton>
        <EuiSpacer size="l" />
      </EuiForm>
    );
  }
}

export default withAuthData(withFirebase(ContactForm));
