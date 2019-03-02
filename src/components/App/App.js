import React, { Component } from 'react'
import './App.css'
import setAuthToken from '../../utils/setAuthToken'
import jwt_decode from 'jwt-decode'

import Header from '../Header/Header'
import Main from '../Main/Main'
import Authorization from '../Authorization/Authorization'
import Queries from '../../API/queries'
import UserMessages from '../UserMessages/UserMessages'

class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUser: null,
      authVisible: false,
      authLeaving: false,
      errors: [],
      messages: [],
    }
  }

  displayAuth = () => {
    this.setState({authVisible: true})
  }

  dismissAuth = async () => {
    await this.setState({
      authLeaving: true,
    })
    setTimeout(() => {
      this.setState({
        authVisible: false,
        authLeaving: false,
      })
    }, 600)
  }

  displayMessages = (messages, errors) => {
    this.setState(prev => {
      if (messages) {
        messages.forEach(message => {
          prev.messages.push(message)
        })
      } 
      if (errors) {
        errors.forEach(error => {
          prev.errors.push(error)
        })
      }
      return prev
    })
  }

  dismissMessage = (message, error) => {
    this.setState(prev => {
      if (message) {
        const index = prev.messages.indexOf(message)
        prev.messages.splice(index, 1)
      }
      if (error) {
        const index = prev.errors.indexOf(error)
        prev.errors.splice(index, 1)
      }
      return prev
    })
  }

  setCurrentUser = async (auth_token, setLocal = true) => {
    if (setLocal) {
      localStorage.setItem("brianToken", auth_token)
    }
    setAuthToken(auth_token)
    const decoded = jwt_decode(auth_token)
    const {user, errors} = await Queries.getUser(decoded.user_id)
    if (errors) {
      return this.setState({errors})
    }
    await this.setState({
      currentUser: user,
    })
    this.dismissAuth()
  }

  checkForAuthToken = () => {
    if (localStorage.brianToken) {
      const auth_token = localStorage.brianToken
      this.setCurrentUser(auth_token, false)
    } else {
      this.setState({authVisible: true})
    }
  }
  
  logoutUser = () => {
    localStorage.removeItem('brianToken')
    setAuthToken(false)
    this.setState({
      currentUser: null,
      authVisible: true,
    })
  }

  componentDidMount() {
    this.checkForAuthToken()
  }

  render() {
    return (
      <div className="App">
        <UserMessages errors={this.state.errors} messages={this.state.messages} dismissMessage={this.dismissMessage} />
        <Header currentUser={this.state.currentUser} logoutUser={this.logoutUser} requestAuth={this.displayAuth} />
        { this.state.authVisible && <Authorization currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser} dismiss={this.dismissAuth} leaving={this.state.authLeaving} displayMessages={this.displayMessages} /> }
        <Main currentUser={this.state.currentUser} displayMessages={this.displayMessages} />
      </div>
    )
  }
}

export default App