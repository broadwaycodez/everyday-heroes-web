import React from 'react'
import './Authorization.css'

import Login from './Login'
import Register from './Register'

class Authorization extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="Authorization">
        <Login />
        <Register />
      </div>
    )
  }
}

export default Authorization