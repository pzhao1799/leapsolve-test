// Earnings page once problem is complete

import React, { Component } from "react";

import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";
import { withRouter } from "react-router-dom";

import {
  EuiText,
  EuiPanel,
  EuiSpacer,
  EuiForm,
  EuiFormRow,
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiPageContent,
  EuiPageContentBody,
  EuiFieldNumber,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
} from "@elastic/eui";

class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = { tipped: 1.5 };
  }

  componentDidMount() {
    const { firebase } = this.props;

    //Get status of user
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

  onSubmit = (event) => {
    const { incomplete, rated, tipped } = this.state;
    if (rated) {
      this.props.firebase.doGiveRatings(incomplete, rated);
    }
    if (tipped) {
      this.props.firebase.doSetTip(incomplete, tipped);
    } else {
      this.props.firebase.doSetTip(incomplete, 0);
    }
    event.preventDefault();
    this.props.history.push("/user/dashboard");
  };

  render() {
    const question = this.state.question;

    if (question) {
      const acceptedTime = question.acceptedTime;
      const solvedTime = question.solvedTime;
      const totalTime = Math.floor((solvedTime - acceptedTime) / 1000 / 60);
      const basePrice = question.basePrice.toFixed(2);
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
                  <b>Total Price:</b>
                  <p>${basePrice}</p>
                </EuiText>

                <EuiSpacer />

                <EuiPanel>
                  <EuiForm
                    component="form"
                    onSubmit={this.onSubmit}
                    className="form"
                  >
                    <EuiText>
                      <h3>Send Feedback</h3>
                      <p>Please rate and tip your solver.</p>
                    </EuiText>
                    <EuiSpacer size="s" />
                    <EuiFormRow
                      label="Solver Rating"
                      display="rowCompressed"
                      fullWidth
                    >
                      <EuiFlexGroup alignItems="center" justifyContent="center">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <EuiFlexItem key={i} grow={false}>
                            <EuiButtonIcon
                              onClick={() => this.setState({ rated: i })}
                              iconType={
                                i <= this.state.rated
                                  ? "starFilled"
                                  : "starEmpty"
                              }
                              iconSize="xl"
                              aria-label="star"
                            />
                          </EuiFlexItem>
                        ))}
                      </EuiFlexGroup>
                    </EuiFormRow>
                    <EuiFormRow label="Tip Amount" display="rowCompressed">
                      <EuiFieldNumber
                        value={this.state.tipped}
                        onChange={(e) => {
                          const parsed = parseFloat(e.target.value);
                          if (isNaN(parsed)) return "";
                          this.setState({ tipped: parsed });
                        }}
                        min={0}
                        step={0.5}
                      />
                    </EuiFormRow>
                    <EuiButton type="submit" fill>
                      Submit
                    </EuiButton>
                  </EuiForm>
                </EuiPanel>
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

export default withAuthData(withFirebase(withRouter(Verification)));
