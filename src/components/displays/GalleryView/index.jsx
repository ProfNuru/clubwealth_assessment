import React from 'react'
import DataGallery from '../../ui/DataGallery'
import classes from './GalleryView.module.css'

const GalleryView = ({api}) => {

  return (
    <div className={classes.tableCollection}>
      <DataGallery />
    </div>
  )
}

export default GalleryView