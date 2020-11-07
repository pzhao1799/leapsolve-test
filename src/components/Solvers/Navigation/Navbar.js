// Navigation bar

import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import {
  EuiButton,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderLinks,
} from "@elastic/eui";
import EuiCustomHeaderLink from "../../utility/EuiCustomHeaderLink";

import { FaWrench } from "react-icons/fa";

import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";

class Navigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = (event) => {
    this.props.firebase.doSignOut().then(() => {
      this.props.history.push("/solver/landing");
    });
  };

  renderTemps() {
    if(this.state.matched)
      return (
        <EuiHeaderSection>
          <EuiHeaderSectionItem>
            <EuiCustomHeaderLink to="/solver/problem">
              Current Problem
            </EuiCustomHeaderLink>
          </EuiHeaderSectionItem>
        </EuiHeaderSection>
      );
    if(this.state.incomplete)
      return (
        <EuiHeaderSection>
          <EuiHeaderSectionItem>
            <EuiCustomHeaderLink to="/solver/verification">
              Last Problem
            </EuiCustomHeaderLink>
          </EuiHeaderSectionItem>
        </EuiHeaderSection>
      );
    return null;
  }

  render(props) {
    //TODO: make less hacky, but authdata doesn't update uid state fast enough
    if(this.props.uid) {
      try{
        this.props.firebase.getStatus()
        .then((profile) => {
          this.setState({
            incomplete: profile.val().incomplete,
            matched: profile.val().matched,
          });
        })
      }
      catch(error) {
        console.log("Not logged in as " + this.props.uid);
      }
    }
    if (this.props.role === "solver") {
      return (
        <EuiHeader>
          <EuiHeaderLinks>
            <EuiCustomHeaderLink to="/solver/dashboard">
              <FaWrench />
              &nbsp; Leap<span className="solve">Solve</span>
            </EuiCustomHeaderLink>
          </EuiHeaderLinks>

          {this.renderTemps()}

          <EuiHeaderSection>
            <EuiHeaderSectionItem>
              <EuiCustomHeaderLink to="/solver/account">
                {this.props.username}
              </EuiCustomHeaderLink>

              <EuiButton onClick={this.onClick}>Log Out</EuiButton>
            </EuiHeaderSectionItem>
          </EuiHeaderSection>
        </EuiHeader>
      );
    } else {
      return (
        <EuiHeader>
          <EuiHeaderLinks>
            <EuiCustomHeaderLink to="/solver">
              <FaWrench />
              &nbsp; Leap<span className="solve">Solve</span>
            </EuiCustomHeaderLink>

            <EuiCustomHeaderLink to="/user">Switch to User</EuiCustomHeaderLink>
          </EuiHeaderLinks>

          <EuiHeaderSection>
            <EuiHeaderLinks>
              <EuiCustomHeaderLink to="/solver/landing/sign-in">
                <EuiButton fill>Sign In</EuiButton>
              </EuiCustomHeaderLink>

              <EuiCustomHeaderLink to="/solver/landing/register">
                <EuiButton>Register</EuiButton>
              </EuiCustomHeaderLink>
            </EuiHeaderLinks>
          </EuiHeaderSection>
        </EuiHeader>
      );
    }
  }
}

export default withRouter(withFirebase(withAuthData(Navigation)));
