// Ask another question (very similar to index.js - Dashboard)
import React, { Component } from "react";
import {
  EuiAccordion,
  EuiListGroup,
  EuiListGroupItem,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiSpacer,
  EuiTitle,
} from "@elastic/eui";
import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";

import SolutionBlurb from "../Questions/SolutionBlurb/index";
import QuestionBar from "../QuestionBar/QuestionBar";

class NewQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = { questions: [] };
  }

  componentDidMount() {
    this.props.firebase.doGetUserQuestions().then((questions) => {
      if (questions.val()) {
        const questionMap = questions.val();
        const questionIds = Object.keys(questionMap);

        if (questionIds.length > 0) {
          const questions = questionIds.map((id) => ({
            ...questionMap[id],
            id,
          }));
          this.setState({ questions });
        }
      }
    });
  }

  renderQuestions(questions) {
    return (
      <EuiListGroup maxWidth={false}>
        {questions.map((q, i) => (
          <EuiListGroupItem
            key={q.id}
            label={<SolutionBlurb question={questions[i]} qid={q.id} />}
          ></EuiListGroupItem>
        ))}
      </EuiListGroup>
    );
  }

  renderSolvedQuestions() {
    const { questions } = this.state;
    const finishedQuestions = questions.filter(
      (q) => q.state !== "open" && q.state !== "current"
    );
    if (finishedQuestions.length === 0) return null;

    return (
      <>
        <EuiTitle size="s">
          <h3>Solved Question{finishedQuestions.length !== 1 && "s"}</h3>
        </EuiTitle>
        <EuiSpacer size="m" />
        {this.renderQuestions(finishedQuestions)}
      </>
    );
  }

  renderCurrentQuestions() {
    const { questions } = this.state;
    const currentQuestions = questions.filter((q) => q.state === "open" || q.state === "current");
    // if (currentQuestions.length === 0) return null;
    return null;

    // return (
    //   <>
    //     <EuiTitle size="s">
    //       <h3>Current Question{currentQuestions.length !== 1 && "s"}</h3>
    //     </EuiTitle>
    //     <EuiSpacer size="m" />
    //     {this.renderQuestions(currentQuestions)}
    //   </>
    // );
  }

  render() {
    const { questions } = this.state;
    const currentQuestions = questions.filter((q) => q.state === "open" || q.state === "current");

    return (
      <EuiPage restrictWidth>
        <EuiPageBody component="div">
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>Dashboard</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle>
                  <h2>Welcome to LeapSolve</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>

            <EuiPageContentBody>
              <EuiAccordion
                id="accordionForm1"
                className="euiAccordionForm"
                buttonClassName="euiAccordionForm__button"
                buttonContent={
                  <span>
                  <EuiTitle>
                    <h2>Have a tech problem?</h2>
                  </EuiTitle>
                  <p>Solve it now!</p>
                  </span>

                }
                paddingSize="l"
              >
                <EuiSpacer size="m" />
                <QuestionBar />
              </EuiAccordion>
            </EuiPageContentBody>
            <EuiSpacer size="m" />
            {this.renderSolvedQuestions()}
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export default withAuthData(withFirebase(NewQuestion));
