import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './CongressPerson.css'

const socialTypes = [
  'facebook',
  'twitter',
  'youtube',
  'rss',
  'website'
]

const images = {}
for (const type of socialTypes) {
  images[type] = require(`./images/${type}.svg`)
}

class SocialLinks extends Component {
  constructor(){
    super()
    this.state = {
      socialTypes
    }
  }
  render() {
    return (
      <div className="SocialLinks">
        {this.state.socialTypes.map(social => <SocialLink key={social} url={this.props[social]} type={social} />)}
      </div>
    )
  }
}

const SocialLink = ({url, type}) => {
  return (
    <a href={url} title={type} target="_blank">
      <img src={images[type]} alt=""/>
    </a>
  )
}

SocialLinks.propTypes = {
  facebook: PropTypes.string,
  twitter: PropTypes.string,
  youtube: PropTypes.string,
  rss: PropTypes.string,
  website: PropTypes.string
}

export default SocialLinks
