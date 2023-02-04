import React, { useEffect, useState } from 'react'
import useRequestResource from '../../../hooks/useRequestResource'
import DataTable from '../../ui/DataTable'
import Loading from '../../ui/Loading'
import classes from './TableView.module.css'

const TableView = () => {
  
  return (
    <div className={classes.tableCollection}>
      <DataTable />
    </div>
  )
}

export default TableView