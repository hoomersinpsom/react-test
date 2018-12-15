import React, { Component } from 'react'
import PropTypes from 'prop-types'



class Search extends Component {
  constructor(){
    super()
    this.state = {
      search: ''
    }
  }
  handleInput = e => {
    const {name, value} = e.target
    this.setState({
      [name]: value
    })
  }
  handleSearch = e => {
    e.preventDefault()
    this.props.onSubmit([{'name': this.state.search}])
    this.setState({
      search: ''
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSearch} className="input-group">
        <input type="search" name="search" value={this.state.search} onChange={this.handleInput} required placeholder="Name" className="form-control"/>
        <div className="input-group-append">
          <button className="btn">
            Find
          </button>
        </div>
      </form>
    )
  }
}

Search.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default Search
