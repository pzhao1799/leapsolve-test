// Form for viewing and changing a solver's talents
import React, { Component } from "react";

import { withFirebase } from "components/Firebase";
import { withAuthData } from "components/Session";
import Editable from "./editable";
import { EuiButton, EuiButtonEmpty, EuiForm, EuiSpacer } from "@elastic/eui";

const BLANK_STATE = {
  newCount: 0,
  talents: {},
  error: null,
};

class TalentsForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...BLANK_STATE };
  }

  componentDidMount() {
    this.props.firebase
      .doGetTalents(this.props.uid)
      .then((talents) => {
        if (talents.val()) {
          this.setState({ talents: talents.val() });
        }
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  onSubmit = (event) => {
    this.props.firebase
      .doUpdateTalents(this.props.uid, this.state.talents)
      .catch((error) => {
        this.setState({ error });
      });
  };

  addTalent = (event) => {
    var newTalents = this.state.talents;
    var count = "new" + this.state.newCount;
    this.setState((state) => {
      newTalents[count] = "Name Me";
      return { talents: newTalents, newCount: this.state.newCount + 1 };
    });
  };

  removeTalent = (id) => {
    var talents = this.state.talents;
    talents[id] = null;
    this.setState({ talents: talents });
  };

  changeText = (event, id) => {
    var newTalents = this.state.talents;
    newTalents[id] = event.target.value;
    this.setState({ talents: newTalents });
  };

  render() {
    const { talents, error } = this.state;
    var shownTalents = [];
    for (var id in talents) {
      shownTalents.push(
        <Editable
          text={talents[id]}
          id={id}
          removeHandler={(id) => this.removeTalent(id)}
          onChange={(event, id) => this.changeText(event, id)}
          key={id}
        />
      );
    }
    return (
      <EuiForm onSubmit={this.onSubmit}>
        {shownTalents}

        <EuiSpacer size="m" />
        <EuiButtonEmpty onClick={this.addTalent}>Add Talent</EuiButtonEmpty>
        <EuiButton type="submit" fill>
          Save Changes
        </EuiButton>
        {error && <p>{error.message}</p>}
      </EuiForm>
    );
  }
}

export default withAuthData(withFirebase(TalentsForm));
