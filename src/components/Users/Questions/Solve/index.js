// Solve a question by choosing a solver and talking with them

import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { withFirebase } from "components/Firebase";
import {
  EuiBadge,
  EuiButton,
  EuiButtonEmpty,
  EuiForm,
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
  EuiPanel,
  EuiTextArea,
  EuiAvatar,
  EuiFlexItem,
  EuiFlexGroup,
} from "@elastic/eui";

class Solve extends Component {
  constructor(props) {
    super(props);
    const qid = this.props.match.params.qid;
    this.state = { qid, newMessage: "", messages: [] };
  }

  componentDidMount() {
    this.updateQuestion();
  }

  updateQuestion = () => {
    const { qid } = this.state;
    const { firebase } = this.props;

    firebase
      .doGetQuestion(qid)
      .then((q) => {
        const question = q.val();
        this.setState({ question });
        //If a finished question, leave page
        if (question.state === "finished" || question.state === "incomplete") {
          this.props.history.push("/user/dashboard");
        } else if (question.state === "current") {
          firebase.doGetSolverProfile(question.solver).then((s) => {
            this.setState({ solver: s.val() });
          });

          firebase.onMessageSent(qid, (m) => {
            const messages = this.state.messages;
            this.setState({
              messages: [...messages, { ...m, id: messages.length }],
            });
          });

          firebase.doGetSharedContactMethods(qid).then((c) => {
            if (c.val()) {
              const sharedContactMethods = Object.values(c.val()).filter(
                (v, i, a) => a.indexOf(v) === i
              );
              const preferredSharedContact = c.val()["preferred"];

              this.setState({ preferred: preferredSharedContact });

              firebase.doGetContacts(question.user).then((c) => {
                const contactsForSharedMethods = sharedContactMethods
                  .map((v) => ({ method: v, contact: c.val()[v] }))
                  .filter((v) => v.contact !== "");
                this.setState({ shared: contactsForSharedMethods });
              });
            }
          });
        } else if (question.state === "open") {
          //If an open question show the solver selection screen
          firebase.doGetPotentialSolverProfiles(qid).then((profiles) => {
            this.setState({ profiles: profiles });
          });
        }
      })
      .catch((err) => {
        //If not an available question, redirect
        console.error(err);
        this.props.history.push("/user/dashboard");
      });
  };

  renderMessage(message) {
    // TODO: make more robust in the future
    const user =
      message.sender === this.props.firebase.getUid() ? "ME" : "SOLVER";

    if (user === "SOLVER") {
      return (
        <div key={message.id} style={{ margin: 5 }}>
          <EuiAvatar size="m" name={user} />
          &nbsp; &nbsp; &nbsp;
          {message.text}
        </div>
      );
    }

    return (
      <div key={message.id} style={{ margin: 5, textAlign: "right" }}>
        {message.text}
        &nbsp; &nbsp; &nbsp;
        <EuiAvatar size="m" name={"M E"} />
      </div>
    );
  }

  onClick = (event) => {
    this.props.history.push("/user/verification");
  };

  renderMessaging() {
    const onSubmit = (e) => {
      e.preventDefault();

      const { qid, newMessage } = this.state;

      this.setState({ newMessage: "" });
      this.props.firebase.doSendMessage(qid, newMessage);
    };

    return (
      <>
        <EuiText>
          <h4>Chat Window</h4>
        </EuiText>
        <EuiPanel className="chat-window">
          {this.state.messages?.map((m) => this.renderMessage(m))}
        </EuiPanel>
        {this.renderContactButtons()}
        <EuiSpacer />
        <EuiForm onSubmit={onSubmit} component="form">
          <EuiTextArea
            fullWidth
            resize="none"
            placeholder="New Message"
            value={this.state.newMessage}
            onChange={(e) => this.setState({ newMessage: e.target.value })}
          />

          <EuiSpacer />

          <EuiFlexGroup justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiButton type="submit" fill>
                Send Message
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiForm>
        <EuiSpacer />
        {/** TODO: make it have a loading spinner! */}
        <EuiButton 
          // isDisabled={this.state.timer !== undefined}
          onClick={this.onClick}>
            I'm Done!
        </EuiButton>
      </>
    );
  }

  renderSolverDescription(solver, type) {
    if (!solver) return null;

    const { username, description, mainRating, timesRated } = solver;

    let rating = mainRating;
    if (!mainRating || timesRated < 3) {
      rating = "?";
    } else {
      rating = rating.toFixed(1);
    }

    const selectSolver = (uid) => {
      this.props.firebase.doSelectSolver(this.state.qid, uid).then(() => {
        this.props.history.push(`/refresh`);
        this.props.history.replace(`/user/questions/current/${this.state.qid}`);
      });
    };

    return (
      <>
        <EuiSpacer size="m" />
        <EuiCard
          title={username}
          description={description}
          footer={
            type === "potential" ? (
              <>
                <EuiButton onClick={() => selectSolver(solver.uid)}>
                  Choose this solver
                </EuiButton>
                <EuiSpacer size="s" />
                <EuiStat
                  title={`${rating} / 5.0`}
                  description="Rating"
                  textAlign="center"
                  titleColor="primary"
                  titleSize="l"
                />
              </>
            ) : null
          }
        />
      </>
    );
  }

  renderSolverSection() {
    if (!this.state.solver) return null;

    return (
      <>
        {this.renderSolverDescription(this.state.solver, "matched")}
        <EuiSpacer />
        {this.renderMessaging()}
        <EuiSpacer size="l" />
        <EuiText>
          <strong>Price: </strong> $8
        </EuiText>
      </>
    );
  }

  renderContactButtons() {
    const { qid, shared, preferred } = this.state;

    const capitalize = (string) => {
      return `${string.charAt(0).toUpperCase()}${string.substring(1)}`;
    };

    if (!(shared?.length > 0)) return null;
    return (
      <>
        <EuiSpacer />
        <EuiText>
          <strong>Contact Methods:</strong>
        </EuiText>

        {shared.map(({ method, contact }) => {
          const onClick =
            method === "email"
              ? () =>
                  this.props.firebase.doSendMessage(
                    qid,
                    `Contact me by email at ${contact}`
                  )
              : () =>
                  this.props.firebase.doSendMessage(
                    qid,
                    `Contact me on ${capitalize(method)} at ${contact}`
                  );
          return (
            <EuiButtonEmpty
              key="method"
              onClick={onClick}
              style={{ fontWeight: preferred === method ? 700 : 400 }}
            >
              {capitalize(method)}
            </EuiButtonEmpty>
          );
        })}
      </>
    );
  }

  renderSolverSelection() {
    const { profiles } = this.state;
    if (this.state.question.state !== "open") return null;
    if (!profiles || profiles.length === 0) {
      return <p>Our Solver team will connect with you shortly!</p>;
    }

    return (
      <>
        <EuiText>
          <h2>Choose your Solver</h2>
        </EuiText>
        {profiles.map((profile, index) => {
          return (
            <div key={index}>
              {this.renderSolverDescription(profile, "potential")}
            </div>
          );
        })}
      </>
    );
  }

  renderQuestionInformation() {
    const { question } = this.state;
    const { hardware, software, deviceType, device, askedTime } = question;

    const makeBadgeIfPresent = (item, color = "default", label = "") => {
      if (item && label) return <EuiBadge color={color}>{label}</EuiBadge>;
      if (item) return <EuiBadge color={color}>{item}</EuiBadge>;
    };

    return (
      <>
        <EuiText>
          <p>
            {" "}
            <b>Description:</b> {question.details}
          </p>
        </EuiText>
        <p>
          {" "}
          <b>Asked:</b> {new Date(askedTime).toDateString()}
        </p>

        {makeBadgeIfPresent(hardware, "secondary", "hardware")}
        {makeBadgeIfPresent(software, "accent", "software")}
        {makeBadgeIfPresent(deviceType, "warning")}
        {makeBadgeIfPresent(device, "danger")}
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
                {this.renderSolverSelection()}
                {this.renderSolverSection()}
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

export default withFirebase(withRouter(Solve));
