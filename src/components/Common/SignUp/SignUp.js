// Registration page

import React, { Component } from "react";
import SignUpForm from "./SignUpForm/SignUpForm";
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiText,
} from "@elastic/eui";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = { role: props.role };
  }

  render() {
    return (
      <EuiPage restrictWidth>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l" id="landing-header">
                <h1>Join us!</h1>
              </EuiTitle>
              <EuiText>
                <h3>Get your tech problems solved fast and painlessly.</h3>{" "}
              </EuiText>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent
            horizontalPosition="center"
            style={{ border: "1px solid #9170B8" }}
            className="borderless"
          >
            <SignUpForm role={this.state.role} />
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export default SignUp;
