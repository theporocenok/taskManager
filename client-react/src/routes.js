import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from "./pages/AuthPage";
import {TasksPage} from "./pages/TasksPage";

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/tasks" exact component={TasksPage} />
        <Redirect to="/tasks" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact component={AuthPage} />
      <Redirect to="/" />
    </Switch>
  )
}