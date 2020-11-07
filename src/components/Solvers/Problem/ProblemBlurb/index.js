// A quick overivew of a question with links to a more detailed page

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { EuiText } from "@elastic/eui";

class ProblemBlurb extends Component {
  constructor(props) {
    super(props);

    const question = this.props.question;

    this.state = { ...this.props.question, qid: this.props.qid };

    this.state.kind = question.open ? "Question" : "Solution";
  }

  render() {
    const { title, askedTime } = this.state;

    const date = new Date(askedTime);

    return (
      <EuiText>
        <b>
          <Link to="/solver/problem">{title}</Link>
        </b>
        , asked <b>{date.toDateString()}</b>
      </EuiText>
    );
  }
}

export default ProblemBlurb;
