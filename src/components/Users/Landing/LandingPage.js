// Landing page

import React, { Component } from "react";
import { Link } from "react-router-dom";

import SignUpForm from "../../Common/SignUp/SignUpForm/SignUpForm";
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
import { withAuthData } from "components/Session";

import "./LandingPage.css";

class Landing extends Component {
  render(props) {
    const isUser = this.props.role === "user";
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
                  LeapSolve is designed for people like you, who have tech
                  problems that they want help fixing. We connect you to
                  experienced solvers that will easily and fairly guide you
                  through the process of troubleshooting your problem.
                </p>
                <h3>Ready to get solutions?</h3>
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
              {isUser ? (
                <Link to="/user/dashboard">Start Getting Solutions</Link>
              ) : (
                <SignUpForm role="user" />
              )}
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export default withAuthData(Landing);
