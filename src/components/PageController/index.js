import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './PageController.css'

// the pagination i shoose the simplest style just for the test,
// but with the props 'actual' and 'total' i could make all kinds
// of pagination, but i need to speed up the code hahaha
class PageController extends Component {
  paginate = (e, index) => {
    const {actual, total} = this.props
    e.preventDefault()
    if((actual === 1 && index === -1) || (actual === total && index === +1)) return false
    this.props.onPaginate(index)
  }

  render() {
    const {actual, total} = this.props
    return total > 0 &&
      <div className="PageController text-right mb-3">
        <a href="" className={classnames('btn', {'disabled': actual === 1})} onClick={e => this.paginate(e, -1)}>
          &lt; prev
        </a>
        <span>
          {`${actual} / ${total}`}
        </span>
        <a href="" className={classnames('btn', {'disabled': actual === total})} onClick={e => this.paginate(e, +1)}>
          next &gt;
        </a>
      </div>
  }
}

PageController.propTypes = {
  actual: PropTypes.number,
  total: PropTypes.number,
  onPaginate: PropTypes.func
}

export default PageController