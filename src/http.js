export function fetchMembers (session, chamber) {
  return new Promise((resolve) => {
    fetch(`https://api.propublica.org/congress/v1/${session}/${chamber}/members.json`, {
      headers: new Headers({
        'X-API-Key': 'd0ywBucVrXRlMQhENZxRtL3O7NPgtou2mwnLARTr',
      }),
    })
    .then(res => res.json())
    .then(json => json.results[0].members)
    .then(members => {
      resolve(members)
    })
  })
} 