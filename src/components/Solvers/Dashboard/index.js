// Default homepage for logged-in solvers
import React, { Component } from "react";
import {
  EuiBasicTable,
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiText,
  EuiSpacer,
  EuiCallOut,
} from "@elastic/eui";

import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";
import { withRouter } from "react-router-dom";

import ProblemBlurb from "../Problem/ProblemBlurb";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.updateData();
  }

  updateData = () => {
    //Retrieve status of the solver
    this.props.firebase
      .getStatus()
      .then((profile) => {
        this.setState({
          working: profile.val().working,
          matched: profile.val().matched,
          potential: profile.val().potential,
        });
      })
      .then(() => {
        //Get question data if matched
        if (this.state.matched) {
          this.props.firebase
            .doGetQuestion(this.state.matched)
            .then((question) => {
              this.setState({ question: question.val() });
            });
        }
      });

    this.updateQuestions();
  };

  updateQuestions = () => {
    // Retrieves open questions
    this.props.firebase.doGetOpenQuestions().then((questions) => {
      const q = questions.val();
      if (!q) return;

      const qids = Object.keys(q);

      const openQuestions = qids.map((qid) => ({
        ...q[qid],
        qid,
        selected: false,
      }));

      this.setState({
        openQuestions,
      });
    });
  };

  startWorking = (event) => {
    this.props.firebase.doStartWorking().then(() => {
      this.updateData();
    });
    console.log(event.target);
  };

  stopWorking = (event) => {
    this.props.firebase
      .doStopWorking()
      .then(() => {
        this.updateData();
      })
      .catch((error) => {
        console.log("Need to wait for 2 minutes before unselecting a problem.");
      });
  };

  renderOpenQuestions = () => {
    const clickHandler = (question) => {
      const openQuestions = [...this.state.openQuestions];
      const index = openQuestions.indexOf(question);
      let updatedQuestion = { ...question, selected: true };
      openQuestions[index] = updatedQuestion;
      this.setState({ openQuestions });

      const timer = setInterval(() => {
        const { timeRemaining } = this.state;

        if (timeRemaining === 0) {
          clearInterval(timer);
          this.setState({ timer: undefined });
        }
        this.setState({ timeRemaining: timeRemaining - 1 });
      }, 1000);

      this.setState({ timer, timeRemaining: 120 });

      this.props.firebase
        .doSelectPotentialQuestion(question.qid)
        .then(() => {
          this.updateData();
        })
        .catch(() => {
          updatedQuestion = { ...question, selected: false };
          openQuestions[index] = updatedQuestion;
          this.setState({ openQuestions });
        });

      this.props.firebase.onQuestionMatched(question.qid, (wasChosen) => {
        if (wasChosen) {
          alert("You have been matched with a user! You can start solving now.");
          //setTimeout(() => this.props.history.push("/solver/dashboard"), 2000);
        }
      });
    };

    // TODO(walnut): this is just a hacky workaround
    const TimerComponent = () => {
      if (this.state.timer) {
        return (
          <span>
            Great choice! The user will get back to you soon, but if they
            haven't in {this.state.timeRemaining} seconds you're free to select
            another.
          </span>
        );
      }
      return null;
    };

    const isQuestionSelected = (question) => {
      return question.qid === this.state.potential;
    };

    return (
      <>
        <EuiCallOut title="Useful Tips" iconType="search">
          <ol>
            <li>Choose a problem that is suited to your expertise!</li>
            <li>Provide excellent customer service to get tips!</li>
            <li>
              You can only choose one problem at a time, and must wait for 2
              minutes after choosing before you switch to a different question
            </li>
          </ol>
        </EuiCallOut>
        <EuiSpacer />
        <EuiBasicTable
          columns={[
            { field: "title", name: "Title" },
            { field: "deviceType", name: "Device" },
            {
              field: "wareType",
              name: "Problem",
              render: (_, question) => {
                const hardware = question.hardware;
                const software = question.software;
                if (hardware && software) {
                  return "Mixed";
                } else if (hardware) {
                  return "Hardware";
                } else if (software) {
                  return "Software";
                } else {
                  return "Not Known";
                }
              },
            },
            {
              field: "device",
              name: "Device Details",
              render: (device) => {
                if (device) return device;
                return "NA";
              },
            },
            {
              field: "application",
              name: "Application",
              render: (application) => {
                if (application) return application;
                return "NA";
              },
            },
            {
              field: "askedTime",
              name: "Asked At",
              render: (askedTime) => new Date(askedTime).toDateString(),
            },
            {
              field: "selected",
              name: "Select",
              render: (_, question) => {
                if (isQuestionSelected(question))
                  return (
                    <EuiButton fill isDisabled>
                      Selected
                    </EuiButton>
                  );

                return (
                  <EuiButton
                    isDisabled={this.state.timer !== undefined}
                    onClick={() => clickHandler(question)}
                  >
                    Select
                  </EuiButton>
                );
              },
            },
          ]}
          rowHeader="title"
          items={this.state.openQuestions}
        />
        <EuiSpacer />
        <TimerComponent />
        <EuiSpacer />
        <EuiButton
          onClick={this.stopWorking}
          isDisabled={this.state.timer !== undefined}
        >
          Stop Working
        </EuiButton>
      </>
    );
  };

  getTitleAndContent = () => {
    const { working, matched, question, openQuestions } = this.state;
    if (working) {
      if (matched) {
        if (question) {
          return {
            title: "Ready to go!",
            body: (
              <EuiText>
                <h3>Here's your problem: </h3>
                <EuiSpacer />
                <ProblemBlurb
                  question={this.state.question}
                  qid={this.state.matched}
                />
                <EuiSpacer />
                <p>
                  Your user is waiting! Start solving now to get a better tip
                  and rating.
                </p>
              </EuiText>
            ),
          };
        } else {
          //Question hasn't loaded yet
          return { body: "Just one moment..." };
        }
      } else {
        //If hasn't been matched with a question but there are open questions
        if (openQuestions) {
          return {
            title: "What question would you like to solve?",
            body: this.renderOpenQuestions(),
          };
        }

        //If hasn't been matched and there aren't open questions
        return {
          title: "Any moment now...",
          body: (
            <EuiText>
              <p>
                We're still finding the best new questions for you. If you set
                up your contact preferences we can let you know as soon as new
                questions come in.
              </p>
            </EuiText>
          ),
        };
      }
    }

    return {
      title: "Welcome, Solver!",
      body: (
        <>
          <EuiButton fill onClick={this.startWorking}>
            Start Solving
          </EuiButton>
          <EuiSpacer size="xl" />
          <EuiText>
            <h3>Steps for success</h3>
            <p>
              LeapSolve connects you to questions and clients when you want to
              work.
            </p>
            <p>
              <b>Finding a Question</b> starts when you press
              <i> Start Solving</i>. We'll show you the latest questions, and
              you decide what you want to work on. Select your question and the
              user who asked it will decide if they want to work with you.
            </p>
            <p>
              <b>Connecting to Users</b> is important for solving questions,
              gaining reputation, and earning good tips. Users can see your
              profile, including past ratings and an introduction message you
              can customize under your account settings. Some users care more
              about speed and efficiency, and others want friendly and simple
              explanations of their problems. Make sure they know your strengths
              through your profile so they are likely to want to work with you!
            </p>
            <p>
              <b>Solving the Problem</b> starts as soon as the user selects you,
              so stay nearby while you select potential questions. On the
              <i> Current Problem</i> page you can see all the details of a
              problem, which will give you a good start to solving it. You can
              message the user to get more information or switch to another
              communication channel if video, voice, or text would be more
              useful. We make communication easy based on your preferences under
              account settings, so update those based on what methods you'd like
              to share with your clients.
            </p>
            <p>
              <b>Finishing Up</b> happens once you press <i> Problem Solved!</i>
              . Make sure you and the user are ready for the question to be
              over: maybe they want tips for how to solve this problem in the
              future or have related questions they'd like to ask you. We decide
              the base payment per problem, taking into account the time you
              spend working. However, the user is likely to tip you for your
              work, and the easiest ways to increase this tip are by working
              quickly and helping kindly. Once they've paid you, we keep the
              funds in your account wallet for a week, and after that period
              you're free to transfer the funds into your connected payment
              accounts. All this can be customized under your account settings.
            </p>
          </EuiText>
        </>
      ),
    };
  };

  render() {
    const { title, body } = this.getTitleAndContent();
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
                  <h2>{title}</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiPageContentBody>{body}</EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export default withAuthData(withFirebase(withRouter(Dashboard)));
