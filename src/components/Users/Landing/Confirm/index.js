// Registration confirmation page
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiText,
  EuiTitle,
} from "@elastic/eui";

class Confirm extends Component {
  render(props) {
    return (
      <EuiPage restrictWidth>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>Welcome to the club.</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiText>
              <p>First check your email for the confirmation.</p>
              <p>Then you're set to go! Sign In and head to the dashboard.</p>
              <p>
                Start asking a question and we'll connect you with a
                knowledgeable solver.
              </p>
            </EuiText>

            <Link to="/user/landing/sign-in">Start Getting Solutions</Link>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export default Confirm;
