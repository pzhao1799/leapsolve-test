// The solver's wallet
import React, { Component } from "react";
import {
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiStat,
  EuiIcon,
} from "@elastic/eui";

class Wallet extends Component {
  render() {
    return (
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiCard
            title="Account Balance"
            icon={<EuiIcon size="xxl" type="logstashQueue" />}
            description=""
          >
            <EuiStat
              titleSize="m"
              title="$23.20"
              textAlign="center"
              description=""
            />
          </EuiCard>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCard
            title="Bank Account"
            icon={<EuiIcon size="xxl" type="logstashInput" />}
            description=""
          >
            <EuiStat
              titleSize="s"
              title="VISA 412938120391"
              textAlign="center"
              description=""
            />
          </EuiCard>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCard
            title="Next Payout On"
            icon={<EuiIcon size="xxl" type="calendar" />}
            description=""
          >
            <EuiStat
              titleSize="m"
              title="June 14"
              textAlign="center"
              description=""
            />
          </EuiCard>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
}

export default Wallet;
