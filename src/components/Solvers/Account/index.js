// The solver's account page
import React, { Component } from "react";
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiHorizontalRule,
  EuiSpacer,
  EuiIconTip,
  EuiFlexGroup,
  EuiFlexItem,
} from "@elastic/eui";

import PasswordChangeForm from "../../Common/PasswordChange/PasswordChangeForm";
import TalentsForm from "./Talents";
import ContactForm from "../../Common/Contact/ContactForm";
import ProfileDescription from "./ProfileDescription";
import Wallet from "./Wallet";

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
            <EuiFlexGroup alignItems="center">
              <EuiFlexItem grow={false}>
                <EuiTitle size="s">
                  <h3>Wallet</h3>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiIconTip
                  content="View your current earnings and change where you get paid"
                  position="right"
                />
              </EuiFlexItem>
            </EuiFlexGroup>

            <EuiSpacer size="s" />
            <Wallet />

            <EuiSpacer size="l" />
            <EuiHorizontalRule />
            <EuiSpacer size="l" />

            <EuiFlexGroup alignItems="center">
              <EuiFlexItem grow={false}>
                <EuiTitle size="s">
                  <h3>Add your top talents</h3>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiIconTip
                  content="These software and hardware talents help us filter which questions you'd like to solve"
                  position="right"
                />
              </EuiFlexItem>
            </EuiFlexGroup>

            <EuiSpacer size="s" />
            <TalentsForm />

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
                  content="Let clients connect with you over these platforms. We'll prioritize your preferred choice."
                  position="right"
                />
              </EuiFlexItem>
            </EuiFlexGroup>

            <EuiSpacer size="s" />
            <ContactForm />

            <EuiSpacer size="l" />
            <EuiHorizontalRule />
            <EuiSpacer size="l" />

            <EuiFlexGroup alignItems="center">
              <EuiFlexItem grow={false}>
                <EuiTitle size="s">
                  <h3>Profile Description</h3>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiIconTip
                  content="An introduction to you and your areas of expertise. This is the first thing users see when you select their questions."
                  position="right"
                />
              </EuiFlexItem>
            </EuiFlexGroup>

            <EuiSpacer size="s" />
            <ProfileDescription />

            <EuiSpacer size="l" />
            <EuiHorizontalRule />
            <EuiSpacer size="l" />

            <EuiTitle size="m">
              <h2>Change Password</h2>
            </EuiTitle>
            <EuiSpacer size="m" />
            <PasswordChangeForm />
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export default Account;
