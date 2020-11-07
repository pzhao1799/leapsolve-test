// Earnings page once problem is complete

import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";

import {
  EuiText,
  EuiSpacer,
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiPageContent,
  EuiPageContentBody,
} from "@elastic/eui";

class Verification extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { firebase } = this.props;

    //Get status of solver
    firebase
      .getStatus()
      .then((profile) => {
        this.setState({
          incomplete: profile.val().incomplete,
        });
      })
      .then(() => {
        //Get current problem
        firebase.doGetQuestion(this.state.incomplete).then((q) => {
          const question = q.val();
          this.setState({ question });
        });
      });
  }

  render() {
    const question = this.state.question;

    if (question) {
      const acceptedTime = question.acceptedTime;
      const solvedTime = question.solvedTime;
      const totalTime = Math.floor((solvedTime - acceptedTime) / 1000 / 60);
      let basePayout = question.basePayout?.toFixed(2);
      if (!basePayout) basePayout = 5.76;
      const tip =
        question.state === "incomplete" ? "Unknown" : "$" + question.tip;
      return (
        <EuiPage restrictWidth>
          <EuiPageBody component="div">
            <EuiPageHeader>
              <EuiPageHeaderSection>
                <EuiTitle size="l">
                  <h1>{question.title}</h1>
                </EuiTitle>
              </EuiPageHeaderSection>
            </EuiPageHeader>

            <EuiPageContent>
              <EuiPageContentBody>
                <EuiText>
                  <b>Details:</b>
                  <p>{question.details}</p>
                  <b>Time Taken:</b>
                  <p>{totalTime} minutes</p>
                  <b>Payment Earned:</b>
                  <p>${basePayout}</p>
                  <b>Tip:</b>
                  <p>{tip}</p>
                </EuiText>

                <EuiSpacer />

                <EuiButton>
                  <Link to="/solver/dashboard">Keep Solving</Link>
                </EuiButton>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      );
    } else {
      return (
        <EuiPage restrictWidth>
          <EuiPageBody component="div">
            <EuiPageContent>
              <EuiPageContentBody>
                <EuiText>
                  <h1>No question...</h1>
                </EuiText>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      );
    }
  }
}

export default withAuthData(withFirebase(Verification));
