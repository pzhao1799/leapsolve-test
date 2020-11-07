// User account page

import React, { Component } from "react";

import PasswordChangeForm from "../../Common/PasswordChange/PasswordChangeForm";
import ContactForm from "../../Common/Contact/ContactForm";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIconTip,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiSpacer,
  EuiTitle,
  EuiHorizontalRule,
} from "@elastic/eui";

class Account extends Component {
  render() {
    return (
      <EuiPage restrictWidth>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>Account Information</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiTitle size="m">
              <h2>Change Password</h2>
            </EuiTitle>
            <EuiSpacer />
            <PasswordChangeForm />

            <EuiSpacer size="l" />
            <EuiHorizontalRule />
            <EuiSpacer size="l" />

            <EuiFlexGroup alignItems="center">
              <EuiFlexItem grow={false}>
                <EuiTitle size="s">
                  <h3>Communication Methods</h3>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiIconTip
                  content="Let solvers connect with you over these platforms. We'll prioritize your preferred choice."
                  position="right"
                />
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="s" />
            <ContactForm />
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export default Account;
