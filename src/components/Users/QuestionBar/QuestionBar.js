// Question form for Users

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  EuiButton,
  EuiCheckboxGroup,
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiRadioGroup,
  EuiSpacer,
  EuiTextArea,
  EuiText,
} from "@elastic/eui";

import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";

const BLANK_STATE = {
  application: "",
  hardware: false,
  software: false,
  title: "",
  details: "",
  device: "",
  deviceType: "MacOS",
  error: null,
  displayError: false,
};

class QuestionBar extends Component {
  constructor(props) {
    super(props);

    this.state = { ...BLANK_STATE };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onCheckboxChange = (id) => {
    this.setState({ [id]: !this.state[id] });
  };

  onRadioChange = (id) => {
    this.setState({ deviceType: id });
  };

  onSubmit = (event) => {
    event.preventDefault();

    this.setState({ displayError: true });

    const {
      application,
      details,
      device,
      deviceType,
      hardware,
      software,
      title,
    } = this.state;

    if (title === "" || details === "") return;

    try {
      this.props.firebase
        .doAskQuestion(
          application,
          details,
          device,
          deviceType,
          hardware,
          software,
          title
        )
        .then(() => {
          this.setState({ ...BLANK_STATE });
          this.props.history.push("/user/questions");
        })
        .catch((error) => {
          // TODO: show these errors to the user only if they are user friendly!
          this.setState({ error });
        });
    } catch (error) {
      // This catch block is necessary because the "update" command also throws errors.
      this.setState({ error });
    }
  };

  render() {
    const {
      application,
      details,
      device,
      deviceType,
      displayError,
      hardware,
      software,
      title,
    } = this.state;

    const invalid = title === "" || details === "";

    let errors = [];
    if (invalid) {
      errors = ["Title and Details must be filled up!"];
    }

    const checkboxes = [
      {
        label: "Hardware",
        id: "hardware",
      },
      {
        label: "Software",
        id: "software",
      },
    ];

    const checkboxIdToSelectedMap = {
      hardware: hardware,
      software: software,
    };

    const radios = [
      { label: "MacOS", id: "MacOS" },
      { label: "PC", id: "PC" },
      { label: "Linux", id: "Linux" },
      { label: "ChromeOS", id: "ChromeOS" },
      { label: "iOS", id: "iOS" },
      { label: "Android", id: "Android" },
    ];

    return (
      <EuiForm
        component="form"
        onSubmit={this.onSubmit}
        error={errors}
        isInvalid={invalid && displayError}
      >
        <EuiDescribedFormGroup
          title={<h3>Briefly describe the problem you are facing</h3>}
        >
          <EuiFormRow label="Problem">
            <EuiFieldText
              name="title"
              value={title}
              onChange={this.onChange}
              isInvalid={title === "" && displayError}
              error={
                title === "" ? "Problem Statement must not be empty!" : null
              }
            />
          </EuiFormRow>
        </EuiDescribedFormGroup>

        <EuiDescribedFormGroup
          title={<h3>Is this a hardware or a software issue?</h3>}
        >
          <EuiFormRow label="Hardware/Software">
            <EuiCheckboxGroup
              onChange={this.onCheckboxChange}
              options={checkboxes}
              idToSelectedMap={checkboxIdToSelectedMap}
            />
          </EuiFormRow>
        </EuiDescribedFormGroup>

        <EuiDescribedFormGroup
          title={
            <h3>What kind of device are you encountering this issue on?</h3>
          }
        >
          <EuiFormRow label="Device Type">
            <EuiRadioGroup
              onChange={this.onRadioChange}
              options={radios}
              idSelected={deviceType}
            />
          </EuiFormRow>
        </EuiDescribedFormGroup>

        {software && (
          <EuiDescribedFormGroup
            title={<h3>What applications are you experiencing issues with?</h3>}
          >
            <EuiFormRow label="Application">
              <EuiFieldText
                name="application"
                value={application}
                onChange={this.onChange}
              />
            </EuiFormRow>
          </EuiDescribedFormGroup>
        )}

        {hardware && (
          <EuiDescribedFormGroup
            title={
              <h3>
                What is the brand and model of the device you are facing issues
                on?
              </h3>
            }
          >
            <EuiFormRow label="Device">
              <EuiFieldText
                name="device"
                value={device}
                onChange={this.onChange}
              />
            </EuiFormRow>
          </EuiDescribedFormGroup>
        )}

        <EuiDescribedFormGroup
          title={<h3>Details</h3>}
          description={
            <>
              The more information you give, the better our Solvers will be able
              to help!
            </>
          }
        >
          <EuiFormRow label="Details">
            <EuiTextArea
              name="details"
              value={details}
              onChange={this.onChange}
              isInvalid={details === "" && displayError}
              error={details === "" ? "Details must not be empty!" : null}
            />
          </EuiFormRow>
        </EuiDescribedFormGroup>

        <EuiDescribedFormGroup title={<h3>Expected Price</h3>}>
          <EuiText>$8</EuiText>
        </EuiDescribedFormGroup>

        <EuiSpacer size="m" />
        <EuiButton type="submit" fill>
          Send!
        </EuiButton>
        <EuiSpacer size="l" />
      </EuiForm>
    );
  }
}

export default withAuthData(withRouter(withFirebase(QuestionBar)));
