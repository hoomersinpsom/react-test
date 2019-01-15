import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './Filters.css'

// This is a general filter everything that is on the member object
// can be filtered jus by creating a input here i made some basic examples
// just to see this working, if this was a real project i will need to
// know which of these informations is important to be filtered 
// and where i can gather the data to pass to a input, like all states 
// and districts of USA for example ;)

class Filters extends Component {
  constructor(){
    super()
    this.state = {
      party: '',
      next_election: '',
      gender: '',
      show: false,
    }
  }
  toggleDrop = e => {
    this.setState( ({show}) => {
      return {
        show: !show
      }
    })
  }
  handleInput = e => {
    const {name, value} = e.target
    this.setState({
      [name]: value
    })
  }
  handleSubmit = e => {
    e.preventDefault()
    this.setState({
      show: false
    })
    const filters = []
    for (const key of Object.keys(this.state)){
      const term = this.state[key]
      if (term && key !== 'show') {
        filters.push({[key]: term})
      }
    }
    this.props.onSubmit(filters)
  }

  render() {
    return (
    <div className="dropdown Filters">
      <button type="button" onClick={this.toggleDrop} className="btn dropdown-toggle" data-toggle="dropdown">
        Filters
      </button>
      <div className={classnames("dropdown-menu", {'show': this.state.show})}>
        <form onSubmit={this.handleSubmit} >
          <div className="form-group">
            <label >Party</label>
            <select name="party" className="form-control" value={this.state.party} onChange={this.handleInput}>
              <option value="">Select</option>
              <option value="D">Democrat</option>
              <option value="R">Republican</option>
            </select>
          </div>
          <div className="form-group">
            <label >Next Election Year</label>
            <input type="number" min="2019" max="2100" name="next_election" value={this.state.next_election} onChange={this.handleInput} className="form-control"/>
          </div>
          <div className="form-group">
            <label >Gender</label>
            <select name="gender" className="form-control" value={this.state.gender} onChange={this.handleInput}>
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="text-right">
            <button className="btn">
              Apply Filters
            </button>
          </div>
        </form>
      </div>
      
    </div>
    )
  }
}

Filters.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default Filters
