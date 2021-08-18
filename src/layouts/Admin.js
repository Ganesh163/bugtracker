import React, { useContext } from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "react-perfect-scrollbar";
import { Route, Switch, useLocation, Redirect } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import { UserContext } from "context/UserContext";

var ps;

function Dashboard(props) {
  const { state } = useContext(UserContext);
  const { user } = state;

  if (user == null) {
    return <Redirect to="/signin" />;
  }
  return (
    <div className="wrapper">
      <Sidebar {...props} routes={routes} bgColor="black" activeColor="info" />
      <div className="main-panel">
        <DemoNavbar {...props} />
        <Switch>
          {routes.map((prop, key) => {
            return (
              <Route
                path={prop.layout + prop.path}
                component={prop.component}
                key={key}
              />
            );
          })}
        </Switch>
        <Footer fluid />
      </div>
    </div>
  );
}

export default Dashboard;
