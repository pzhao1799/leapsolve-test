import React from "react";
import { EuiHeaderLink } from "@elastic/eui";
import { useHistory } from "react-router";

const isModifiedEvent = (event) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const isLeftClickEvent = (event) => event.button === 0;

const isTargetBlank = (event) => {
  const target = event.target.getAttribute("target");
  return target && target !== "_self";
};

export default function EuiCustomHeaderLink({ to, ...rest }) {
  // This is the key!
  const history = useHistory();

  function onClick(event) {
    if (event.defaultPrevented) {
      return;
    }

    // Let the browser handle links that open new tabs/windows
    if (
      isModifiedEvent(event) ||
      !isLeftClickEvent(event) ||
      isTargetBlank(event)
    ) {
      return;
    }

    // Prevent regular link behavior, which causes a browser refresh.
    event.preventDefault();

    // Push the route to the history.
    history.push(to);
  }

  // Generate the correct link href (with basename accounted for)
  const href = history.createHref({ pathname: to });

  const props = { ...rest, href, onClick };
  return <EuiHeaderLink {...props} />;
}