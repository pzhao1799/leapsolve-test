// Navigation bar

import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import {
  EuiHeader,
  EuiButton,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderLinks,
  EuiNotificationBadge,
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
      this.props.history.push("/user/landing");
    });
  };

  renderTemps() {
    if (this.state.current)
      return (
        <EuiHeaderSection>
          <EuiHeaderSectionItem>
            <EuiCustomHeaderLink to={"/user/question" + this.state.current}>
              Current Question
            </EuiCustomHeaderLink>
          </EuiHeaderSectionItem>
        </EuiHeaderSection>
      );
    if (this.state.incomplete)
      return (
        <EuiHeaderSection>
          <EuiHeaderSectionItem>
            <EuiCustomHeaderLink to="/user/verification">
              Last Question
              <EuiNotificationBadge
                style={{ verticalAlign: "top", margin: "5px" }}
              >
                !
              </EuiNotificationBadge>
            </EuiCustomHeaderLink>
          </EuiHeaderSectionItem>
        </EuiHeaderSection>
      );
    return null;
  }

  render(props) {
    //TODO: make less hacky, but authdata doesn't update uid state fast enough
    if (this.props.uid) {
      try {
        this.props.firebase.getStatus().then((profile) => {
          this.setState({
            incomplete: profile.val().incomplete,
            matched: profile.val().matched,
          });
        });
      } catch (error) {
        console.log("Not logged in as " + this.props.uid);
      }
    }
    if (this.props.role === "user") {
      return (
        <EuiHeader>
          <EuiHeaderLinks>
            <EuiCustomHeaderLink to="/user/dashboard">
              <FaWrench />
              &nbsp; Leap<span className="solve">Solve</span>
            </EuiCustomHeaderLink>
            <EuiCustomHeaderLink to="/user/questions">
              Questions
            </EuiCustomHeaderLink>
            <EuiCustomHeaderLink to="/user/newquestion">
              New Question
            </EuiCustomHeaderLink>
          </EuiHeaderLinks>

          {this.renderTemps()}

          <EuiHeaderSection>
            <EuiHeaderSectionItem>
              <EuiCustomHeaderLink to="/user/account">
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
            <EuiCustomHeaderLink to="/user/landing">
              <FaWrench />
              &nbsp; Leap<span className="solve">Solve</span>
            </EuiCustomHeaderLink>

            <EuiCustomHeaderLink to="/solver">
              Switch to Solver
            </EuiCustomHeaderLink>
          </EuiHeaderLinks>

          <EuiHeaderSection>
            <EuiHeaderLinks>
              <EuiCustomHeaderLink to="/user/landing/sign-in">
                <EuiButton fill>Sign In</EuiButton>
              </EuiCustomHeaderLink>

              <EuiCustomHeaderLink to="/user/landing/register">
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
