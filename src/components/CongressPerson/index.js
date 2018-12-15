import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './CongressPerson.css'
import SocialLinks from './SocialLinks'

class CongressPerson extends Component {
  render() {
    const {title, first_name, last_name, party, next_election} = this.props.member
    const {youtube_account, twitter_account, url, facebook_account, rss_url} = this.props.member
    return (
      <div className="CongressPerson">
        <Party party={party} />
        <p className="CongressPerson-title mb-0">
          <small>{title}</small>
          <strong>{` ${first_name} ${last_name}`}</strong>
        </p>
        <p>Next election year: {next_election}</p>
        <SocialLinks
          twitter={'http://twitter.com/' + twitter_account}
          youtube={'http://youtube.com/' + youtube_account}
          facebook={'http://facebook.com/' + facebook_account}
          rss={rss_url}
          website={url}
        />
      </div>
    )
  }
}

const Party = ({party}) => {
  return (
    <div title={party === 'D' ? 'Democrat' : 'Republican'} className={"CongressPerson-party --" + party.toLowerCase()}>
      <span>{party}</span>
    </div>
  )
}

CongressPerson.propTypes = {
  member: PropTypes.object.isRequired,
}

export default CongressPerson
