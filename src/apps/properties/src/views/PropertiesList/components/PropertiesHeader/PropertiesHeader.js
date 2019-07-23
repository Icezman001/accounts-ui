import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import debounce from '../../../../../../../util/debounce'

import { sortSites } from '../../../../store/sites'
import { saveProfile } from '../../../../../../../shell/store/user'

import { Select, Option } from '@zesty-io/core/Select'
import { Search } from '@zesty-io/core/Search'
import { ButtonGroup } from '@zesty-io/core/ButtonGroup'
import { Button } from '@zesty-io/core/Button'

import styles from './PropertiesHeader.less'
class PropertiesHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eco: false,
      sort: 'name'
    }
  }
  componentDidMount() {
    // set the ecosystem state to the store's value
    this.props.settings &&
      this.props.settings.eco &&
      this.setState({ eco: this.props.settings.eco })
  }
  render() {
    return (
      <header className={styles.PropertiesHeader}>
        <div className={styles.Actions}>
          {this.props.ecosystems.length ? (
            <Select
              className={styles.Ecosystem}
              name="ecoFilter"
              onSelect={this.filterByEco}
              selection={
                this.props.ecosystems
                  .filter(eco => eco.id == this.state.eco)
                  .map(eco => {
                    return { value: eco.id, text: eco.name }
                  })[0]
              }>
              {this.props.ecosystems
                .filter(eco => eco.id !== this.state.eco)
                .map(eco => {
                  return <Option key={eco.id} value={eco.id} text={eco.name} />
                })}
            </Select>
          ) : null}

          <Search
            className={styles.Search}
            override={this.props.settings && this.props.settings.filter}
            placeholder="Search by instance name or domain"
            onSubmit={this.onSearch}
            onKeyUp={this.onSearch}
          />

          <ButtonGroup className={styles.Sort}>
            <Button
              title="Sort alphabetically by name"
              disabled={this.state.sort === 'name'}
              onClick={() => {
                this.setState({ sort: 'name' })
                return this.sort('name')
              }}>
              <i className={`fa fa-sort-alpha-asc`} />
            </Button>
            <Button
              title="Sort by created date"
              disabled={this.state.sort === 'date'}
              onClick={() => {
                this.setState({ sort: 'date' })
                return this.sort('createdAt')
              }}>
              <i className={`fa fa-calendar-o`} />
            </Button>
          </ButtonGroup>

          <ButtonGroup className={styles.Layout}>
            <Button
              title="View instances as a grid"
              disabled={this.props.layout === 'grid'}
              onClick={() => {
                this.props.dispatch({
                  type: 'INSTANCE_LAYOUT',
                  layout: 'grid'
                })
                this.props.dispatch(saveProfile())
              }}>
              <i className={`fa fa-th`} />
            </Button>
            <Button
              title="View instances as a list"
              disabled={this.props.layout === 'list'}
              onClick={() => {
                this.props.dispatch({
                  type: 'INSTANCE_LAYOUT',
                  layout: 'list'
                })
                this.props.dispatch(saveProfile())
              }}>
              <i className={`fa fa-th-list`} />
            </Button>
          </ButtonGroup>
        </div>
      </header>
    )
  }

  onSearch = debounce(term => {
    this.setState({ searchTerm: term }, () =>
      this.props.dispatch({
        type: 'SETTING_FILTER',
        filter: this.state.searchTerm
      })
    )
  }, 300)

  filterByEco = evt => {
    if (evt.target.dataset.value === '') {
      this.setState({ eco: false })
      return this.props.dispatch({
        type: 'SETTING_ECO',
        eco: ''
      })
    }
    this.setState({ eco: evt.target.dataset.value })
    this.props.dispatch({
      type: 'SETTING_ECO',
      eco: Number(evt.target.dataset.value)
    })
  }

  sort = by => {
    this.props.dispatch(sortSites(by))
  }
}

export default withRouter(connect(state => state)(PropertiesHeader))
