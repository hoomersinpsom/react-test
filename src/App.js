import React, { Component } from 'react'
import logo from './logo.png'
import './App.css'
import CongressPerson from './components/CongressPerson'
import Search from './components/Search'
import Filters from './components/Filters'
import FilterList from './components/Filters/FilterList'
import PageController from './components/PageController'
import {fetchMembers} from './http'
// you should feel free to reorganize the code however you see fit
// including creating additional folders/files and organizing your
// components however you would like.

// i just put all the data on a localStorage as a simple cache,
// it could be improved with a expiration, but i will need to know how much this
// information should be updated etc just for the sake of this test i will keep it simple ;)

const members = JSON.parse(localStorage.members || null) || null
// const members = null

class App extends Component {
  constructor() {
    super()
    this.state = {
      searchTerm: '',
      members,
      filters: {},
      filteredMembers: members ? [...members] : null,
      visibleMembers: [],
      pageNumber: 1,
      pageSize: 10,
      pageTotal: null,
      loading: true,
    }
  }
  componentWillMount() {
    if (!localStorage.session || !localStorage.chamber) {
      localStorage.session = 115
      localStorage.chamber = 'senate'
    }
    const {session, chamber} = localStorage
    this.setState({
      session,
      chamber
    }, this.loadMembers)
  }
  loadMembers = (force = false) => {
    if (!this.state.members || force) {
      this.setState({
        loading: true
      })
      fetchMembers(this.state.session, this.state.chamber).then(members => {
        this.setState({
          members,
          filteredMembers: [...members]
        }, () => {
          this.setMembers()
        })
        localStorage.members = JSON.stringify(members)
      })
    } else {
      this.setMembers()
    }
  }
  nameSearch = (searchTerm, member) => {
    const {first_name, middle_name, last_name} = member
    const a = (first_name && first_name.toLowerCase())
    const b = (middle_name && middle_name.toLowerCase())
    const c = (last_name && last_name.toLowerCase())
    const name = a+b+c
    const rgx = new RegExp(searchTerm.toLowerCase())
    return name.match(rgx)
  }
  setFilters = async filters => {
    for (const filter of filters){
      await this.setState(state => {
        return {
          filters:{
            ...state.filters,
            ...filter
          }
        }
      })
    }
    this.applyFilters()
  }
  removeFilter = filterKey => {
    const tempFilter = {...this.state.filters}
    delete tempFilter[filterKey]
    this.setState({
      filters: tempFilter
    }, this.applyFilters)
  }
  setMembers = (members = false) => {
    let number  = this.state.pageNumber - 1
    let finalMembers = members ? members : this.state.filteredMembers
    const visibleMembers = finalMembers.slice(number * this.state.pageSize, (number + 1) * this.state.pageSize)
    this.setState({
      visibleMembers,
      pageTotal: Math.ceil(finalMembers.length / this.state.pageSize),
      loading: false
    })
  }
  applyFilters = () => {
    const filteredMembers = this.state.members.filter(member => {
      for (const key of Object.keys(this.state.filters)) {
        if (key === 'name') {
          return this.nameSearch(this.state.filters[key], member) 
        }
        if (member[key] === undefined || member[key] !== this.state.filters[key]){
          return false
        }
      }
      return true
    })
    this.setState({
      filteredMembers,
      pageNumber: 1
    }, () => {
      this.setMembers(filteredMembers)
    })
  }
  setPage = index => {
    this.setState(state => {
      return {
        pageNumber: state.pageNumber + index
      }
    }, this.setMembers)
  }
  handleParams = (e, type) => {
    const {value} = e.target
    this.setState({
      [type]: value
    }, () => {
      localStorage.setItem(type, value)
      this.loadMembers(true)
    })
  }
  render() {
    return (
      <div className="App">
        <Loading show={this.state.loading} />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Programming Exercise</h1>
        </header>
        <section className="container">
          <div className="row">
            <div className="col-md-auto form-group">
              <Chamber
                chamber={this.state.chamber}
                onChange={e => this.handleParams(e, 'chamber')}
              />
            </div>
            <div className="col-md-auto form-group">
              <Session session={this.state.session} onChange={e => this.handleParams(e, 'session')} />
            </div>
          </div>
          <div className="row">
            <div className="col-8 col-md-auto">
              <Search onSubmit={this.setFilters}/>
            </div>
            <div className="col-4 col-md-auto text-right">
              <Filters onSubmit={this.setFilters} />
            </div>
          </div>
          <FilterList filters={this.state.filters} onRemove={this.removeFilter}/>
          <hr/>
          <PageController
            actual={this.state.pageNumber}
            total={this.state.pageTotal}
            onPaginate={this.setPage}
          />
          <div className="row">
            <FilteredMembers members={this.state.visibleMembers} />
          </div>
          <PageController
            actual={this.state.pageNumber}
            total={this.state.pageTotal}
            onPaginate={this.setPage}
          />
        </section>
      </div>
    )
  }
}

const Loading = ({show}) => {
  return (
    <span>
    {show && <div className="Loading">
        <img src={require('./loading.svg')} alt=""/>
      </div>}
    </span>
    )
}

const Chamber = ({chamber, onChange}) => {
  return (
    <div>
      <label >Chamber:</label> <br/>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          name="chamber"
          checked={chamber === 'senate'}
          type="radio"
          onChange={onChange}
          id="inlineradio1"
          value='senate'
        />
        <label className="form-check-label" htmlFor="inlineradio1">Senate</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          name="chamber"
          checked={chamber === 'house'}
          type="radio"
          onChange={onChange}
          id="inlineradio2"
          value='house'
        />
        <label className="form-check-label" htmlFor="inlineradio2">House</label>
      </div>
    </div>
  )
}

const Session = ({session, onChange}) => {
  return (
    <div className="form-group">
      <label>Session</label>
      <input type="number" min="1" max="116"
        className="form-control"
        value={session}
        onChange={onChange}
      />
    </div>
  )
}

const FilteredMembers = ({members}) => {
  if (members.length === 0) {
    return <h1>Not Found :(</h1>
  } 
  return members.map(member => 
    <div className="col-md-6 mb-4" key={member.id}>
      <CongressPerson
        member={member}
      />
    </div>
  )
}

export default App
