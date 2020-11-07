// The solver's current question page with details and communication with the user

import React, { Component } from "react";

import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";
import { withRouter } from "react-router-dom";
import "./Problem.css";

import {
  EuiButtonEmpty,
  EuiBadge,
  EuiText,
  EuiPanel,
  EuiSpacer,
  EuiForm,
  EuiTextArea,
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiPageContent,
  EuiPageContentBody,
  EuiAvatar,
  EuiFlexGroup,
  EuiFlexItem,
} from "@elastic/eui";

class Problem extends Component {
  constructor(props) {
    super(props);

    this.state = { newMessage: "", messages: [] };
  }

  componentDidMount() {
    const { firebase, uid } = this.props;

    //Get status of solver
    firebase
      .getStatus()
      .then((profile) => {
        if(profile.val().matched) {
          this.setState({
            working: profile.val().working,
            matched: profile.val().matched,
          });
        } else {
          setTimeout(() => this.props.history.push("/solver/problem"), 2000);
        }
      })
      .then(() => {
        //Get current problem
        firebase.doGetQuestion(this.state.matched).then((q) => {
          const question = q.val();
          this.setState({ question });

          firebase.onMessageSent(this.state.matched, (m) => {
            const messages = this.state.messages;
            this.setState({
              messages: [...messages, { ...m, id: messages.length }],
            });
          });

          firebase.doGetSharedContactMethods(this.state.matched).then((c) => {
            if (c.val()) {
              const sharedContactMethods = Object.values(c.val()).filter(
                (v, i, a) => a.indexOf(v) === i
              );
              const preferredSharedContact = c.val()["preferred"];

              this.setState({ preferred: preferredSharedContact });

              firebase.doGetContacts(uid).then((c) => {
                const contactsForSharedMethods = sharedContactMethods
                  .map((v) => ({ method: v, contact: c.val()[v] }))
                  .filter((v) => v.contact !== "");

                this.setState({ shared: contactsForSharedMethods });
              });
            }
          });
        });
      });
  }

  renderMessage(message) {
    // TODO: make more robust in the future
    const user =
      message.sender === this.props.firebase.getUid() ? "ME" : "USER";

    if (user === "USER") {
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
    this.props.firebase.doSolveQuestion(this.state.matched).then(() => {
      this.props.history.push("/solver/verification");
    });
  };

  renderContactButtons() {
    const { matched, shared, preferred } = this.state;

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
                    matched,
                    `Contact me by email at ${contact}`
                  )
              : () =>
                  this.props.firebase.doSendMessage(
                    matched,
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

  render() {
    const question = this.state.question;
    const onSubmit = (e) => {
      e.preventDefault();

      const { newMessage, matched } = this.state;

      this.setState({ newMessage: "" });
      this.props.firebase.doSendMessage(matched, newMessage);
    };

    const makeBadgeIfPresent = (item, color = "default", label = "") => {
      if (item && label) return <EuiBadge color={color}>{label}</EuiBadge>;
      if (item) return <EuiBadge color={color}>{item}</EuiBadge>;
    };

    if (question) {
      const { hardware, software, deviceType, device } = question;
      const dateString = new Date(question.askedTime).toDateString();
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
                  <b>Asked at:</b>
                  <p>{dateString}</p>
                  <b>Details:</b>
                  <p>{question.details}</p>

                  {makeBadgeIfPresent(hardware, "secondary", "hardware")}
                  {makeBadgeIfPresent(software, "accent", "software")}
                  {makeBadgeIfPresent(deviceType, "warning")}
                  {makeBadgeIfPresent(device, "danger")}
                </EuiText>

                <EuiSpacer />

                <EuiText>
                  <h4>Chat Window</h4>
                </EuiText>
                <EuiPanel className="chat-window">
                  <EuiText>
                    {this.state.messages?.map((m) => this.renderMessage(m))}
                  </EuiText>
                </EuiPanel>
                {this.renderContactButtons()}
                <EuiSpacer />
                <EuiForm onSubmit={onSubmit} component="form">
                  <EuiTextArea
                    fullWidth
                    resize="none"
                    placeholder="New Message"
                    value={this.state.newMessage}
                    onChange={(e) =>
                      this.setState({ newMessage: e.target.value })
                    }
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
                <EuiButton onClick={this.onClick}>Problem Solved!</EuiButton>
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

export default withAuthData(withFirebase(withRouter(Problem)));
