// The solver's default home page when not signed in

import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiText,
  EuiSpacer,
} from "@elastic/eui";
import SignUpForm from "../../Common/SignUp/SignUpForm/SignUpForm";
import { withAuthData } from "components/Session";

class Landing extends Component {
  render(props) {
    const isSolver = this.props.role === "solver";
    return (
      <EuiPage restrictWidth>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l" id="landing-header">
                <h1>
                  Welcome to Leap<span className="solve">Solve</span>!
                </h1>
              </EuiTitle>
              <EuiText>
                <p>
                  LeapSolve connects people with tech problems to smart, proactive
                  solvers like you! Get paid when you feel like solving!
                </p>
                <p>Ready to solve?</p>
              </EuiText>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent
            horizontalPosition="center"
            style={{ border: "1px solid #9170B8" }}
            className="borderless"
          >
            <EuiPageContentBody>
              <EuiSpacer size="m" />
              {isSolver ? (
                <Link to="/solver/dashboard">Start Solving</Link>
              ) : (
                <SignUpForm role="solver" />
              )}
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export default withAuthData(Landing);
