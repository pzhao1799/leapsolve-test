// Contact information form for solvers
import React, { Component } from "react";
import {
  EuiButton,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiGlobalToastList,
  EuiRadio,
  EuiSpacer,
} from "@elastic/eui";
import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";

const BLANK_STATE = {
  callNumber: "",
  textNumber: "",
  email: "",
  skype: "",
  google: "",
  zoom: "",
  error: null,
  preferred: "",
  toasts: [],
};

class ContactForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...BLANK_STATE };
  }

  componentDidMount() {
    this.props.firebase
      .doGetContacts(this.props.uid)
      .then((contacts) => {
        if (contacts.val()) {
          this.setState(contacts.val());
        }
      })
      .catch((error) => {
        this.setState({ error: [error.message] });
      });
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  updateState = (key, value) => {
    this.setState({ [key]: value });
  };

  removeToast = (removedToast) => {
    this.setState({
      toasts: this.state.toasts.filter((toast) => toast.id !== removedToast.id),
    });
  };

  addToastHandler = (title, color = "success", text = "") => {
    const { toasts } = this.state;
    this.setState({ toasts: toasts.concat({ title, color, text }) });
  };

  onSubmit = (event) => {
    event.preventDefault();

    const {
      callNumber,
      textNumber,
      email,
      skype,
      google,
      zoom,
      preferred,
    } = this.state;

    // Preferred contact cannot be empty
    if (preferred !== "") {
      const preferredContact = this.state[preferred];
      if (preferredContact === "") {
        this.setState({ error: ["Preferred contact cannot be empty!"] });
        return;
      }

      this.props.firebase
        .doSetPreferredContact(preferred)
        .then(() => this.addToastHandler("Preferred Contact Updated!"));
    }

    this.props.firebase
      .doSetContacts({
        callNumber,
        textNumber,
        email,
        skype,
        google,
        zoom,
      })
      .then(() => this.addToastHandler("Contacts Updated!"))
      .catch((error) => {
        this.setState({ error: [error.message] });
      });
  };

  render() {
    const {
      callNumber,
      textNumber,
      email,
      skype,
      google,
      zoom,
      preferred,
      toasts,
    } = this.state;

    const invalid = false;

    return (
      <EuiForm component="form" onSubmit={this.onSubmit}>
        <EuiFormRow label="Phone Number">
          <EuiFieldText
            name="callNumber"
            value={callNumber}
            onChange={this.onChange}
          />
        </EuiFormRow>
        <EuiFormRow>
          <EuiRadio
            label="Preferred?"
            compressed
            checked={preferred === "callNumber"}
            onChange={() => this.updateState("preferred", "callNumber")}
          />
        </EuiFormRow>

        <EuiFormRow label="Phone Number for Texts">
          <EuiFieldText
            name="textNumber"
            value={textNumber}
            onChange={this.onChange}
          />
        </EuiFormRow>
        <EuiFormRow>
          <EuiRadio
            label="Preferred?"
            checked={preferred === "textNumber"}
            onChange={() => this.updateState("preferred", "textNumber")}
          />
        </EuiFormRow>

        <EuiFormRow label="Public Email">
          <EuiFieldText name="email" value={email} onChange={this.onChange} />
        </EuiFormRow>
        <EuiFormRow>
          <EuiRadio
            label="Preferred?"
            checked={preferred === "email"}
            onChange={() => this.updateState("preferred", "email")}
          />
        </EuiFormRow>

        <EuiFormRow label="Skype ID">
          <EuiFieldText name="skype" value={skype} onChange={this.onChange} />
        </EuiFormRow>
        <EuiFormRow>
          <EuiRadio
            label="Preferred?"
            checked={preferred === "skype"}
            onChange={() => this.updateState("preferred", "skype")}
          />
        </EuiFormRow>

        <EuiFormRow label="Google Meets ID">
          <EuiFieldText name="google" value={google} onChange={this.onChange} />
        </EuiFormRow>
        <EuiFormRow>
          <EuiRadio
            label="Preferred?"
            checked={preferred === "google"}
            onChange={() => this.updateState("preferred", "google")}
          />
        </EuiFormRow>

        <EuiFormRow label="Zoom Meeting ID">
          <EuiFieldText name="zoom" value={zoom} onChange={this.onChange} />
        </EuiFormRow>
        <EuiFormRow>
          <EuiRadio
            label="Preferred?"
            checked={preferred === "zoom"}
            onChange={() => this.updateState("preferred", "zoom")}
          />
        </EuiFormRow>

        <EuiButton type="submit" fill disabled={invalid}>
          Save Changes
        </EuiButton>
        <EuiSpacer size="l" />
        <EuiGlobalToastList
          toasts={toasts}
          dismissToast={this.removeToast}
          toastLifeTimeMs={4000}
        />
      </EuiForm>
    );
  }
}

export default withAuthData(withFirebase(ContactForm));
