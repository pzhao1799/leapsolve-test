// The root of the app
import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiFlexItem,
  EuiFlexGroup,
  EuiCard,
  EuiText,
  EuiSpacer,
} from "@elastic/eui";
import { FaHandsHelping, FaWrench } from "react-icons/fa";
import { RiAlarmWarningLine } from "react-icons/ri";

import Solver from "../Solvers";
import User from "../Users";
import { withAuth } from "../Session";
import "./app.css";

const App = () => {
  const history = useHistory();
  return (
    <Switch>
      <Route path="/solver">
        <Solver />
      </Route>

      <Route path="/user">
        <User />
      </Route>
      <Route path="/">
        <EuiPage restrictWidth>
          <EuiPageBody component="div">
            <EuiPageHeader>
              <EuiPageHeaderSection>
                <EuiTitle>
                  <h2>
                    <FaWrench />
                    &nbsp; Leap<span className="solve">Solve</span>
                  </h2>
                </EuiTitle>
              </EuiPageHeaderSection>
            </EuiPageHeader>
            <EuiPageContent
              verticalPosition="center"
              className="borderless shadowless"
            >
              <EuiPageContentBody>
                <EuiText textAlign="center">
                  <h1>Do you want to...</h1>
                </EuiText>
                <EuiSpacer size="l" />
                <EuiFlexGroup id="cta-group">
                  <EuiFlexItem>
                    <EuiCard
                      title={
                        <EuiText>
                          <h1>
                            Solve your <span className="solve">Problems</span>
                          </h1>
                        </EuiText>
                      }
                      icon={<RiAlarmWarningLine size="3em" />}
                      description="We have a talented group of solvers to handle your technical issues, big or small. What are you waiting for?"
                      betaBadgeLabel="User"
                      onClick={() => history.push("/user/landing")}
                      id="user-cta"
                      textAlign="right"
                      footer="← Find a solver today!"
                    />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiCard
                      title={
                        <EuiText>
                          <h1>
                            Be the <span className="solve">Solution</span>
                          </h1>
                        </EuiText>
                      }
                      icon={<FaHandsHelping size="3em" />}
                      description="Join us, and put your skills towards the good of the community. What are you waiting for?"
                      betaBadgeLabel="Solver"
                      onClick={() => history.push("/solver/landing")}
                      textAlign="left"
                      id="solver-cta"
                      footer="Solve a problem today! →"
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      </Route>
    </Switch>
  );
};
export default withAuth(App);
