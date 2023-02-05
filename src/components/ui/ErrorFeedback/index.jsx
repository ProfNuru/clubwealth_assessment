import React from 'react'

const ErrorFeedback = ({msg}) => {
  return (
    <h4 style={{
      color:'darkred',
      fontStyle:'italic',
      margin:'10px 0px',
      fontWeight:'bolder'
    }}>{msg}</h4>
  )
}

export default ErrorFeedback