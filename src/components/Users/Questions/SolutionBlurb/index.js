// A short question overview linking to the question's details page

import React, { Component } from "react";
import { Link } from "react-router-dom";

class SolutionBlurb extends Component {
  constructor(props) {
    super(props);

    const question = this.props.question;

    this.state = { ...this.props.question, qid: this.props.qid };

    this.state.kind = question.state !== "finished" ? "Question" : "Solution";
  }

  render() {
    const { qid, title, askedTime, state } = this.state;

    const date = new Date(askedTime);
    if(state === "open" || state === "current" ) {
      return (
        <>
          <Link to={"/user/questions/current/" + qid}>{title}</Link>
          {`, asked ${date.toDateString()}`}
        </>
      );
    }
    return (
      <>
        <Link to={"/user/questions/" + qid}>{title}</Link>
        {`, asked ${date.toDateString()}`}
      </>
    );

  }
}

export default SolutionBlurb;
