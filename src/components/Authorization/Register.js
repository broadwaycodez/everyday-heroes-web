import React from 'react'
import './Authorization.css'
import Auth from '../../API/auth'
import Validate from '../../utils/validation'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      screen_name: '',
      password: '',
      password_confirmation: '',
      errors: [],
      working: false
    }
  }

  onFormSubmit = async (e) => {
    e.preventDefault()
    if (this.state.working) {
      return null
    }
    this.performRegistration()
  }

  performRegistration = async () => {
    await this.setState({working: true})
    const newUser = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      screen_name: this.state.screen_name,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    }
    const {isValid, errors} = Validate.register(newUser)
    if (!isValid) {
      return this.handleErrors(errors)
    }

    const data = await Auth.register(newUser)
    if (data.errors) {
      return this.handleErrors(data.errors)
    }
    if (data.user) {
      this.signInUser(newUser.email, newUser.password)
    }
  }

  signInUser = async (email, password) => {
    const signInData = await Auth.signIn(email, password)
    const {auth_token, errors} = signInData
    if (errors) {
      return this.handleErrors(errors)
    }
    this.props.setCurrentUser(auth_token)
  }

  handleErrors = errors => {
    let errorsArray = []
    for (let key in errors) {
      errorsArray.push(errors[key])
    }
    this.props.displayMessages(null, errorsArray)
    this.setState({
      errors: errors,
      working: false
    })
  }

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  render() {
    const errors = this.state.errors
    return (
      <div className="Register">
        <h1 className="authorization__heading">Choose to be a Hero!</h1>
        <form className="authorization__form" onSubmit={this.onFormSubmit}>
          <div className="authorization__form-row">
            <label htmlFor="first_name">First Name</label>
            <input type="text" name="first_name" placeholder={errors.first_name} value={this.state.first_name} onChange={this.handleChange} />
          </div>
          <div className="authorization__form-row">
            <label htmlFor="last_name">Last Name</label>
            <input type="text" name="last_name" placeholder={errors.last_name} value={this.state.last_name} onChange={this.handleChange} />
          </div>
          <div className="authorization__form-row">
            <label htmlFor="email">Email</label>
            <input type="text" name="email" placeholder={errors.email} value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className="authorization__form-row">
            <label htmlFor="screen_name">Screen Name</label>
            <input type="text" name="screen_name" placeholder={errors.screen_name} value={this.state.screen_name} onChange={this.handleChange} />
          </div>
          <div className="authorization__form-row">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder={errors.password} value={this.state.password} onChange={this.handleChange} />
          </div>
          <div className="authorization__form-row">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input type="password" name="password_confirmation" placeholder={errors.password_confirmation} value={this.state.password_confirmation} onChange={this.handleChange} />
          </div>
          <button className="authorization__submit">Sign Up!</button>
        </form>
        <div className="authorization__switch">
          <button className="authorization__switch-btn" onClick={this.props.switchScreen}>Already a member?</button>
        </div>
      </div>
    )
  }
}

export default Register