import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import axios from 'axios';
import * as ROUTES from '../constants/routes';
import LoginPage from '../containers/loginPage';
import Statistics from '../containers/statisticsPage';
import AdminProject from '../containers/AdminProjectPage';
import './style.css';
import CohortPage from '../containers/CohortPage';

class App extends Component {
  state = {
    isAuth: false,
    redirect: false,
  };

  async componentDidMount() {
    try {
      const {
        data: { statusCode },
      } = await axios.get('/api/v1/is-auth');
      if (statusCode === 200) {
        this.setState({ isAuth: true });
      } else {
        this.setState({
          isAuth: false,
        });
      }
    } catch (error) {
      this.setState({
        isAuth: false,
        redirect: true,
      });
    }
  }

  updateAuth = () => {
    const { isAuth } = this.state;
    this.setState({ isAuth: !isAuth });
  };

  logout = async () => {
    try {
      const {
        data: { statusCode },
      } = await axios.get('/api/v1/logout');
      if (statusCode === 200) {
        this.setState({ isAuth: false, redirect: true });
      } else {
        this.setState({ isAuth: true });
      }
    } catch (error) {
      this.setState({ isAuth: true });
    }
  };

  render() {
    const { isAuth, redirect } = this.state;

    return (
      <Router>
        <div className="App">
          <Switch>
            <Route
              exact
              path={ROUTES.LOGIN_PAGE}
              render={(props) =>
                isAuth ? (
                  <Redirect to={ROUTES.HOME_PAGE} />
                ) : (
                  <LoginPage {...props} updateAuth={this.updateAuth} />
                )
              }
            />
            {isAuth ? (
              <>
                <Route
                  exact
                  path={ROUTES.HOME_PAGE}
                  render={(props) => (
                    <Statistics {...props} logout={this.logout} />
                  )}
                />
                <Route
                  path={ROUTES.COHORT_PAGE}
                  exact
                  render={() => <CohortPage logout={this.logout} />}
                />
                <Route
                  path={ROUTES.COHORT_PROJECTS_PAGE}
                  exact
                  render={(props) => (
                    <AdminProject {...props} logout={this.logout} />
                  )}
                />
              </>
            ) : redirect ? (
              <Route render={() => <Redirect to={ROUTES.LOGIN_PAGE} />} />
            ) : null}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
