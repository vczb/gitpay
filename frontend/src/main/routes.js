import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'

import PrivateRoute from '../components/session/private-route'

import WelcomeContainer from '../containers/welcome'
import Session from '../components/session/session'
import ProfileContainer from '../containers/profile'
import TaskContainer from '../containers/task'
import TaskOrdersContainer from '../containers/task-orders'
import TaskExplorer from '../containers/task-explorer'
import TeamContainer from '../containers/team.js'
import LoginPage from '../components/session/login-page'
import LoginPageContainer from '../containers/login-page'
import FourOFour from '../components/FourOFour.js'
import LandingPage from '../components/welcome/landing-page'
import Stats from '../components/Stats/Stats-main-page'
import TaskListUser from '../containers/task-list-user'

export default props => (
  <HashRouter>
    <Switch>
      <Route path='/recruitment' component={ LandingPage } />
      <Route exact path='/' component={ WelcomeContainer } />
      <PrivateRoute path='/profile' component={ ProfileContainer } />
      <Route exact path='/projects' component={ TaskExplorer } />
      <Route exact path='/organizations' component={ TaskExplorer } />
      <Route exact path='/organizations/:organization_id' component={ TaskExplorer } />
      <Route exact path='/organizations/:organization_id/:slug' component={ TaskExplorer } />
      <Route exact path='/organizations/:organization_id/projects/:project_id' component={ TaskExplorer } />
      <Route exact path='/organizations/:organization_id/projects/:project_id/:filter' component={ TaskExplorer } />
      <Route exact path='/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug' component={ TaskExplorer } />
      <Route exact path='/organizations/:organization_id/:organization_slug/projects/:project_id/:project_slug/:filter' component={ TaskExplorer } />
      <Route exact path='/tasks/:filter' component={ TaskExplorer } />
      <Route exact path='/team' component={ TeamContainer } />
      <Route exact path='/login' component={ LoginPage } />
      <Route exact path='/login/:status' component={ LoginPageContainer } />
      <Route exact path='/token/:token' component={ Session } />
      <Route exact path='/task/:id' component={ TaskContainer } />
      <Route exact path='/task/:id/:slug' component={ TaskContainer } />
      <Route exact path='/task/:id/orders' component={ TaskContainer } />
      <Route exact path='/task/:id/status' component={ TaskContainer } />
      <Route exact path='/task/:id/status/:status' component={ TaskContainer } />
      <Route exact path='/task/:id/orders/:order_id' component={ TaskContainer } />
      <Route exact path='/task/:id/interested' component={ TaskContainer } />
      <Route exact path='/task/:id/members' component={ TaskContainer } />
      <Route exact path='/task/:id/offers' component={ TaskContainer } />
      <Route exact path='/task/:id/history' component={ TaskContainer } />
      <Route exact path='/task/:id/claim' component={ TaskContainer } />
      <Route exact path='/stats' component={ Stats } />
      <Route
        exact
        path='/task/:id/order/:order_id/status/:status'
        component={ TaskOrdersContainer }
      />
      <Route exact path='/users/:usernameId' component={ TaskListUser } />
      <Route path='/404' component={ FourOFour } />
      <Route component={ FourOFour } />
    </Switch>
  </HashRouter>
)
