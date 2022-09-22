import React    from "react";
import template from "./Dashboard.js";

class Dashboard extends React.Component {
  render() {
    return template.call(this);
  }
}

export default Dashboard;
