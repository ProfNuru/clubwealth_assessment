import React from 'react'
import DataTable from '../../ui/DataTable'
import classes from './TableView.module.css'

const TableView = () => {
  
  return (
    <div className={classes.tableCollection}>
      <DataTable />
    </div>
  )
}

export default TableView