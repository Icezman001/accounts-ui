import React, { Component } from 'react'

import styles from './ResetPasswordStart.less'
import { request } from '../../../util/request'

import { AppLink } from '@zesty-io/core/AppLink'
import { Button } from '@zesty-io/core/Button'

export default class ResetPasswordStart extends Component {
  state = {
    error: false,
    message: '',
    submitted: false
  }
  render() {
    return (
      <section className={styles.ResetPasswordStart}>
        <form
          name="ResetPasswordStart"
          onSubmit={this.handleReset}
          className={styles.ResetPasswordStartForm}>
          <img src="/zesty-io-logo.svg" />

          <label>
            <p>
              Enter the email associated with your account and we will send an
              email with instructions for resetting your password.
            </p>
            <Input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Enter your account email"
            />
          </label>
          <Button type="submit" disabled={this.state.submitted}>
            <i className="fa fa-envelope-o" aria-hidden="true" />
            {this.state.submitted
              ? 'Sending Reset Request'
              : 'Send Password Reset Email'}
          </Button>
          <small>
            <AppLink to="/login">Return to Login?</AppLink>
          </small>

          {this.state.message ? (
            this.state.error ? (
              <p className={styles.error}>
                <i className="fa fa-exclamation-triangle" aria-hidden="true" />
                &nbsp;{this.state.message}
              </p>
            ) : (
              <p>
                <i className="fa fa-info-circle" aria-hidden="true" />
                &nbsp;{this.state.message}
              </p>
            )
          ) : null}
        </form>
      </section>
    )
  }

  handleReset = evt => {
    evt.preventDefault()
    const address = evt.target.email.value
    this.setState({ submitted: true })
    return request(`${CONFIG.API_ACCOUNTS}/users/passwords/resets`, {
      method: 'POST',
      json: true,
      body: {
        address
      }
    })
      .then(() => {
        this.setState({
          message:
            'Check your email and follow the provided link to complete the reset process'
        })
      })
      .catch(() => {
        this.setState({
          error: true,
          message: 'There was a problem requesting a password reset'
        })
      })
      .finally(() => this.setState({ submitted: false }))
  }
}
