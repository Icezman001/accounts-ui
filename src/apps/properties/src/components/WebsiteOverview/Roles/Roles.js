import React, { Component } from 'react'
import { connect } from 'react-redux'

import EditRole from './EditRole'
import { notify } from '../../../../../../shell/store/notifications'
import {
  fetchSiteRoles,
  createRole,
  removeRole,
  getRole
} from '../../../store/sitesRoles'

import styles from './Roles.less'
import { zConfirm } from '../../../../../../shell/store/confirm'

const formatDate = date => {
  if (!date) {
    return ''
  }
  const newDate = new Date(date)
  return `${newDate.getMonth() +
    1}-${newDate.getDate()}-${newDate.getFullYear()}`
}

class Roles extends Component {
  constructor(props) {
    super()
    this.state = {
      submitted: false,
      name: '',
      systemRoleZUID: '',
      expiry: '',
      selectedRole: {
        value: 'Select Role',
        html: '<option value="none">Select Role</option>'
      }
    }
  }
  selectBaseRole = evt => {
    this.setState({
      systemRoleZUID: evt.currentTarget.dataset.value,
      selectedRole: {
        value: evt.currentTarget.dataset.value,
        html: evt.target.innerHTML
      }
    })
  }
  onChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value })
  }
  handleCreate = evt => {
    evt.preventDefault()
    if (this.state.name.length > 0 && this.state.systemRoleZUID.length > 0) {
      this.setState({ submitted: !this.state.submitted })
      this.props
        .dispatch(createRole(this.props.siteZUID, { ...this.state }))
        .then(data => {
          this.props
            .dispatch(getRole(data.ZUID, this.props.siteZUID))
            .then(data => {
              this.props.dispatch({
                type: 'NEW_MODAL',
                component: EditRole,
                props: {
                  siteZUID: this.props.siteZUID,
                  roleZUID: data.ZUID
                }
              })
              this.setState({ submitted: !this.state.submitted, name: '' })
            })
          return this.props.dispatch(
            fetchSiteRoles(this.props.user.ZUID, this.props.siteZUID)
          )
        })
        .catch(err => {
          console.table(err)
          this.setState({ submitted: !this.state.submitted, name: '' })
        })
    } else {
      this.props.dispatch(
        notify({
          message:
            'You must include a name and system role to create a new role.',
          type: 'error'
        })
      )
    }
  }

  handleEdit = (roleZUID, siteZUID) => {
    this.props.dispatch(getRole(roleZUID, siteZUID)).then(data => {
      this.props.dispatch({
        type: 'NEW_MODAL',
        component: EditRole,
        props: {
          siteZUID,
          roleZUID
        }
      })
    })
  }

  handleRemove = ZUID => {
    this.props.dispatch(
      zConfirm({
        prompt: 'Are you certain you want to delete this role?',
        callback: result => {
          // remove role if user confirms
          if (result) {
            return this.props.dispatch(removeRole(ZUID)).then(data => {
              this.props.dispatch(
                notify({
                  message: 'Role successfully removed',
                  type: 'success'
                })
              )
              return this.props.dispatch(
                fetchSiteRoles(this.props.user.ZUID, this.props.siteZUID)
              )
            })
          }
        }
      })
    )
  }
  render() {
    return (
      <div className={styles.permissionsWrapper}>
        <form className={styles.formGrid}>
          <span className={styles.label}>
            <label>Label</label>
            <Input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
            />
          </span>
          <span className={styles.base}>
            <label>Base Role</label>
            <Select
              onSelect={this.selectBaseRole}
              selection={this.state.selectedRole}
              options={[
                {
                  value: '31-71cfc74-4dm13',
                  html: '<option value="31-71cfc74-4dm13">Admin</option>'
                },
                {
                  value: '31-71cfc74-c0ntr1b0t0r',
                  html:
                    '<option value="31-71cfc74-c0ntr1b0t0r">Contributor</option>'
                },
                {
                  value: '31-71cfc74-d3v3l0p3r',
                  html:
                    '<option value="31-71cfc74-d3v3l0p3r">Developer</option>'
                },
                {
                  value: '31-71cfc74-0wn3r',
                  html: '<option value="31-71cfc74-0wn3r">Owner</option>'
                },
                {
                  value: '31-71cfc74-p0bl1shr',
                  html: '<option value="31-71cfc74-p0bl1shr">Publisher</option>'
                },
                {
                  value: '31-71cfc74-s30',
                  html: '<option value="31-71cfc74-s30">SEO</option>'
                }
              ]}
            />
          </span>
          <span className={styles.expires}>
            <label>Exipres(optional)</label>
            <Input type="date" name="expiry" onChange={this.onChange} />
          </span>
          <Button
            className={styles.createButton}
            onClick={this.handleCreate}
            disabled={this.state.submitted}>
            {this.state.submitted ? 'Creating Role' : 'Create Role'}
          </Button>
        </form>
        <div className={styles.currentRoles}>
          <header>
            <h3>Role</h3>
            <h3>Created</h3>
            <h3>Expires</h3>
          </header>
          <main>
            {this.props.sitesRoles[this.props.siteZUID] instanceof Object &&
              Object.entries(this.props.sitesRoles[this.props.siteZUID]).map(
                ([ZUID, role]) => {
                  // exclude base system roles in list of custom roles
                  if (
                    role.name === 'SYSTEM_ROLE' ||
                    role.name === 'Admin' ||
                    role.name === 'Developer' ||
                    role.name === 'Owner' ||
                    role.name === 'SEO' ||
                    role.name === 'Contributor' ||
                    role.name === 'Publisher'
                  ) {
                    return
                  } else {
                    return (
                      <article key={ZUID}>
                        <span>{role.name}</span>
                        <span>{formatDate(role.createdAt)}</span>
                        <span>{formatDate(role.expiry)}</span>
                        <span>
                          <ButtonGroup>
                            <Button
                              text="Edit"
                              onClick={() =>
                                this.handleEdit(ZUID, this.props.siteZUID)
                              }
                            />
                            <Button
                              text="Remove"
                              onClick={() => this.handleRemove(ZUID)}
                            />
                          </ButtonGroup>
                        </span>
                      </article>
                    )
                  }
                }
              )}
          </main>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  // likely need to fetch site specific permissions
  return state
}

export default connect(mapStateToProps)(Roles)
