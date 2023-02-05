import React from 'react'
import classes from './NoInternetAlert.module.css'

const NoInternetAlert = ({btnAction}) => {
  return (
    <div className={classes.noInternetAlertModal}>
        <h4>Failed to load data</h4>
        <p>Check your internet connection</p>
        <p>Data too large to save in local storage...</p>
        <button
        onClick={()=>btnAction()}
        className={classes.closeAlertModalBtn}>x</button>
    </div>
  )
}

export default NoInternetAlert