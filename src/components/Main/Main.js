import React from 'react'
import './Main.css'

import { Switch, Route, Redirect } from 'react-router-dom'
import Today from '../Today/Today'
import Progress from '../Progress/Progress'
import TaskDetail from '../TaskDetail/TaskDetail';

const Main = ({currentUser, setCurrentUser}) => {
  return (
    <div className="Main">
      <h1>Main</h1>
      <Switch>
        <Route path="/" exact render={ props => {
          if (currentUser) {
            return <Redirect to="/today" />
          } else {
            return "Please sign in or create an account"
          }
        }}/>
        <Route path="/today" render={ () => {
          if (currentUser) {
            return <Today />
          } else {
            return <Redirect to="/" />
          }
        }} />
        <Route path="/progress" render={ () => {
          if (currentUser) {
            return <Progress />
          } else {
            return <Redirect to="/" />
          }
        }} />
        <Route path="/tasks" exact render={() => {
          return <Redirect to="/today" />
        }} />
        <Route path="/tasks/:id" render={ props => {
          if (currentUser) {
            const habitId = props.match.params.id
            return <TaskDetail habitId={habitId} />
          } else {
            return <Redirect to="/" />
          }
        }} />
      </Switch>
    </div>
  )
}

export default Main