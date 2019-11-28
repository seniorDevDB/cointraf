import React from 'react';
import { Redirect } from "react-router-dom";
import { Route } from 'react-router-dom';

import Coin from './components/Coin'

function retry(fn, retriesLeft = 5, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }

          // Passing on "reject" is the important part
          retry(fn, interval, retriesLeft - 1).then(resolve, reject);
        }, interval);
      });
  });
}

// lazy load all the views
const Dashboard = React.lazy(() => retry(() => import('./pages/Dashboard')));

// handle auth and authorization

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route {...rest} render={props => {

    // authorised so return component
    return <Component {...props} />
  }} />
)

const routes = [
  // auth and account
  // { path: '/login', name: 'Login', component: Login, route: Route },
  // { path: '/logout', name: 'Logout', component: Logout, route: Route },
  // { path: '/forget-password', name: 'Forget Password', component: ForgetPassword, route: Route },
  // { path: '/register', name: 'Register', component: Register, route: Route },
  // { path: '/confirm', name: 'Confirm', component: ConfirmAccount, route: Route },
  { path: '/coin/:coinName', exact: true, name: 'Coin', component: Coin, route: Route },

  // other pages
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, route: Route, title: 'Dashboard' },
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard" />,
    route: Route
  },

]

export { routes, PrivateRoute };
