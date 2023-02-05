import React from 'react'
import classes from './RecordDetail.module.css'

const RecordDetail = ({
    selectedTableRow,
    closeModal,
    removeRecordAction,
    subCategory
}) => {
  return (
    <div className={classes.recordModal}>
        <div className={classes.modalContent}>
            <button 
            onClick={closeModal}
            className={classes.closeBtn}>x</button>
            <h1>{selectedTableRow?.api.replace('_',' ')}</h1>
            <h2>{subCategory[selectedTableRow?.api].substring(3).replace(/([A-Z]+)/g, ' $1').trim()}</h2>
            <button 
            onClick={()=>removeRecordAction(selectedTableRow?.data)}
            className={classes.removeEntryBtn}>Remove this record</button>
            <small style={{color:'#000',padding:'0px 10px'}}>This removes this record from the table</small>
            
            <div className={classes.detailsGrid}>
            {Object.keys(selectedTableRow?.data).map((field,i)=><div 
            key={i}
            className={classes.detailFields}>
                <p><span>{field.replaceAll('_',' ').replace(/([A-Z]+)/g, ' $1').trim()}</span>: {selectedTableRow?.data[field]}</p>
            </div>)}
            </div>
        </div>
    </div>
  )
}

export default RecordDetail