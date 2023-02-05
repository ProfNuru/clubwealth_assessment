import React, { useState } from 'react'
import classes from './RecordDetail.module.css'

const RecordDetail = ({
    selectedTableRow,
    closeModal,
    removeRecordAction,
    subCategory
}) => {
    const [singleImageUrl, setSingleImageUrl] = useState({})
    const [imagesArray, setImagesArray] = useState([])
    const [fieldDataset, setFieldDataset] = useState({})

    const getFieldDataset = async (url) => {
        
    }

    const isImg = (field, value) => {
        let test = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(value)
        return test
    }

    const isApi = (field, value) => {
        console.log(field, value)
        return false
    }


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
            {Object.keys(selectedTableRow?.data).map((field,i)=>{
                let fieldIsImg = isImg(field,selectedTableRow?.data[field])
                if(fieldIsImg){
                    return <div key={i} style={{
                        gridColumn:'1 / span 1',
                        gridRow:'1 / span 3'

                    }}>
                        <img style={{
                            width:'100%',
                            display:'block',
                            borderRadius:'10px'
                        }}
                        src={selectedTableRow?.data[field]} 
                        alt={`${field} image`} />
                    </div>
                }
                return <div 
                key={i}
                className={classes.detailFields}>
                    <p><span>{field.replaceAll('_',' ').replace(/([A-Z]+)/g, ' $1').trim()}</span>: {selectedTableRow?.data[field]}</p>
                </div>
            })}
            </div>
        </div>
    </div>
  )
}

export default RecordDetail