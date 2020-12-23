// The questions dashboard for users, also included in the user dashboard
import React, { Component } from "react";
import { Switch, Link } from "react-router-dom";
import {
  EuiListGroup,
  EuiListGroupItem,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiText,
  EuiTitle,
  EuiSpacer,
  EuiAccordion
} from "@elastic/eui";

import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";
import ProtectedRoute from "../ProtectedRoute";
import "./Questions.css";
import Solve from "./Solve";
import Summary from "./Summary";
import SolutionBlurb from "./SolutionBlurb";
import QuestionBar from "../QuestionBar/QuestionBar";

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.firebase.doGetUserQuestions().then((questions) => {
      this.setState({ questions: questions.val() });
    });
  }

  renderQuestionsFromQid(qids) {
    return (
      <EuiListGroup maxWidth={false}>
        {qids.map((qid) => (
          <EuiListGroupItem
            key={qid}
            label={
              <SolutionBlurb question={this.state.questions[qid]} qid={qid} />
            }
          ></EuiListGroupItem>
        ))}
      </EuiListGroup>
    );
  }

  renderCurrentQuestions(currentQids) {
    if (currentQids.length > 0) {
      return (
        <>
          <EuiText>
            <h3>Current Question{currentQids > 1 && "s"}</h3>
          </EuiText>
          {this.renderQuestionsFromQid(currentQids)}
        </>
      );
    }

    return null;
  }

  renderIncompleteQuestions(incompleteQids) {
    if (incompleteQids.length > 0) {
      const question = this.state.questions[incompleteQids[0]];
      const solvedDate = new Date(question.solvedTime).toDateString();

      return (
        <>
          <EuiText>
            <h3>Finished Question{incompleteQids > 1 && "s"}:</h3>
            <i>Please rate and tip your solver:</i>
          </EuiText>

          <EuiListGroup>
            <EuiListGroupItem
              key="0"
              label={
                <p>
                  <Link to="/user/verification">{question.title}</Link>, solved
                  on {solvedDate}
                </p>
              }
            />
          </EuiListGroup>
        </>
      );
    }

    return null;
  }

  renderSolvedQuestions(solvedQids) {
    if (solvedQids.length > 0) {
      return (
        <>
          <EuiText>
            <h3>Past Solutions: </h3>
          </EuiText>
          {this.renderQuestionsFromQid(solvedQids)}
        </>
      );
    }

    return null;
  }

  renderQuestions(qids) {
    if (qids?.length > 0) {
      const currentQids = qids.filter(
        (q) =>
          this.state.questions[q]?.state === "current" ||
          this.state.questions[q]?.state === "open"
      );
      const incompleteQids = qids.filter(
        (q) => this.state.questions[q]?.state === "incomplete"
      );
      const solvedQids = qids.filter(
        (q) => this.state.questions[q]?.state === "finished"
      );

      return (
        <>
          {this.renderCurrentQuestions(currentQids)}
          {this.renderIncompleteQuestions(incompleteQids)}
          {this.renderSolvedQuestions(solvedQids)}
        </>
      );
    }

    return (
      <p>
        No questions yet! Start asking questions to make those fixes you've
        always wanted!
      </p>
    );
  }

  render() {
    const qids = this.state.questions
      ? Object.keys(this.state.questions)
      : null;

    return (
      <>
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <h1>Past Solutions and Current Questions</h1>
            </EuiTitle>
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentBody>{this.renderQuestions(qids)}</EuiPageContentBody>
        </EuiPageContent>
      </>
    );
  }
}

const WrappedQuestions = withAuthData(withFirebase(Questions));

class QuestionsWrapper extends Component {
  render() {
    return (
      <EuiPage restrictWidth>
        <EuiPageBody component="div">
          <Switch>
            <ProtectedRoute path="/user/questions/current/:qid">
              <Solve />
            </ProtectedRoute>
            <ProtectedRoute path="/user/questions/:qid">
              <Summary />
            </ProtectedRoute>
            <ProtectedRoute path="/user/questions">
              <WrappedQuestions />
            </ProtectedRoute>
          </Switch>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
const QuestionPage = withAuthData(withFirebase(QuestionsWrapper));
export { QuestionPage, WrappedQuestions };

export default WrappedQuestions;
