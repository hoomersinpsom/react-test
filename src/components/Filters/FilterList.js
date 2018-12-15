import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Filters.css'

class FilterList extends Component {
  remove = (e, filterKey) => {
    e.preventDefault()
    this.props.onRemove(filterKey)
  }

  render() {
    const keys = Object.keys(this.props.filters)
    return (
      <div className="activeFilters">
        {keys.length > 0 && keys.map((key, i) => {
          const element = this.props.filters[key]
          return (
            <span key={i}>
              {key}: {element} <a href="" onClick={e => this.remove(e, key)}>x</a>
            </span>
          )
        })}
      </div>
    )
  }
}

FilterList.propTypes = {
  filters: PropTypes.object
}

export default FilterList
