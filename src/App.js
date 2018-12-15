import React, { Component } from 'react'
import logo from './logo.png'
import './App.css'
import CongressPerson from './components/CongressPerson'
import Search from './components/Search'
import Filters from './components/Filters'
import FilterList from './components/Filters/FilterList'
import PageController from './components/PageController'

// you should feel free to reorganize the code however you see fit
// including creating additional folders/files and organizing your
// components however you would like.
const members = JSON.parse(localStorage.members) || null

class App extends Component {
  constructor() {
    super()
    this.state = {
      searchTerm: '',
      members,
      filters: {},
      filteredMembers: [...members],
      pageNumber: 1,
      pageSize: 10,
      pageTotal: null
    }
  }
  componentWillMount() {
    const session = 115 // 115th congressional session
    const chamber = 'senate' // or 'house'

    // sample API call
    if (!this.state.members) {
      fetch(`https://api.propublica.org/congress/v1/${session}/${chamber}/members.json`, {
        headers: new Headers({
          'X-API-Key': 'd0ywBucVrXRlMQhENZxRtL3O7NPgtou2mwnLARTr',
        }),
      })
      .then((res) => res.json())
      .then((json) => json.results[0].members)
      .then((members) => {
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
      pageTotal: Math.ceil(finalMembers.length / this.state.pageSize)
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
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Programming Exercise</h1>
        </header>
        <section className="container">
          <div className="row">
            <div className="col-8 col-md-8">
              <Search onSubmit={this.setFilters}/>
            </div>
            <div className="col-4 col-md-4 text-right">
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
