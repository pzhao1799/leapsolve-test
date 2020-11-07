// A detailed summary view of a finished question

import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { withFirebase } from "components/Firebase";
import {
  EuiBadge,
  EuiButton,
  EuiLoadingSpinner,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiStat,
  EuiText,
  EuiTitle,
  EuiCard,
  EuiSpacer,
} from "@elastic/eui";

class Summary extends Component {
  constructor(props) {
    super(props);
    const qid = this.props.match.params.qid;
    this.state = { qid };
  }

  componentDidMount() {
    const { qid } = this.state;
    const { firebase } = this.props;

    firebase.doGetQuestion(qid).then((q) => {
      const question = q.val();
      this.setState({ question });
      //If an unfinished question show solver details
      if (question.state !== "finished" && question.solver) {
        firebase.doGetSolverProfile(question.solver).then((s) => {
          this.setState({ solver: s.val() });
        });
      }
    });
  }

  renderSolverDescription(solver) {
    if (!solver) return null;

    const { username, description, mainRating, timesRated } = solver;

    let rating = mainRating;
    if (!mainRating || timesRated < 3) {
      rating = "?";
    }

    const selectSolver = (uid) => {
      this.props.firebase.doSelectSolver(this.state.qid, uid).then(() => {
        this.props.history.push(`/user/questions/current/${this.state.qid}`);
      });
    };

    return (
      <>
        <EuiSpacer size="m" />
        <EuiCard
          title={username}
          description={description}
          footer={
            <EuiButton onClick={() => selectSolver(solver.uid)}>
              Choose this solver
            </EuiButton>
          }
        >
          <EuiStat
            title={`${rating} / 5.0`}
            description="Rating"
            textAlign="center"
            titleColor="primary"
            titleSize="l"
          />
        </EuiCard>
      </>
    );
  }

  renderQuestionInformation() {
    const { question } = this.state;
    const {
      hardware,
      software,
      deviceType,
      device,
      askedTime,
      solvedTime,
      basePrice,
    } = question;

    const makeBadgeIfPresent = (item, color = "default", label = "") => {
      if (item && label) return <EuiBadge color={color}>{label}</EuiBadge>;
      if (item) return <EuiBadge color={color}>{item}</EuiBadge>;
    };

    const tip =
      question.state === "incomplete" ? "Unknown" : "$" + question.tip;

    return (
      <>
        <EuiText>
          <h3>Description</h3>
          <p>{question.details}</p>
        </EuiText>
        {makeBadgeIfPresent(hardware, "secondary", "hardware")}
        {makeBadgeIfPresent(software, "accent", "software")}
        {makeBadgeIfPresent(deviceType, "warning")}
        {makeBadgeIfPresent(device, "danger")}
        <EuiSpacer size="s" />
        <b>Asked:</b>
        <p>{new Date(askedTime).toDateString()}</p>
        <b>Answered:</b>
        <p>{new Date(solvedTime).toDateString()}</p>
        <b>Price:</b>
        <p>{"$" + basePrice.toFixed(2)}</p>
        <b>Tip Given:</b>
        <p>{tip}</p>
      </>
    );
  }

  render() {
    const { question } = this.state;

    if (question) {
      return (
        <>
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
                {this.renderQuestionInformation()}
                <EuiSpacer />
              </EuiText>
            </EuiPageContentBody>
          </EuiPageContent>
        </>
      );
    } else {
      return <EuiLoadingSpinner size="xl" />;
    }
  }
}

export default withRouter(withFirebase(Summary));
