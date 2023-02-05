import axios from 'axios'
import React, { useEffect, useState } from 'react'
import classes from './RecordDetail.module.css'
import Loading from '../Loading'
import ErrorFeedback from '../ErrorFeedback'

const RecordDetail = ({
    selectedTableRow,
    closeModal,
    removeRecordAction,
    subCategory
}) => {
    const [fieldDataset, setFieldDataset] = useState({})
    const [loading, setLoading] = useState(false)
    const [loadingAll, setLoadingAll] = useState(false)
    const [err, setErr] = useState({
        error:false,
        msg:''
    })

    const getFieldDataset = async (url) => {
        try {
            setLoading(true)
          const response = await axios.get(url)
          setLoading(false)
          setErr({error:false,msg:''})
          return response.data
        } catch (error) {
            // console.log(error)
            setLoading(false)
            setErr({error:true,msg:'Failed to fetch data'})
        }
    }

    const isImg = (value) => {
        let test = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(value)
        return test
    }

    const isApi = (value) => {
        if(!Array.isArray(value)){
            let url
            try {
                url = new URL(value)
            } catch (err) {
                return false
            }
            return url.protocol === "http:" || url.protocol === "https:"
        }
    }

    const fetchDataFromApis = async (field,urls) => {
        let dataset = []
        setLoadingAll(true)
        urls.forEach(async (url,i)=>{
            if(isApi(url)){
                const fieldData = await getFieldDataset(url)
                dataset.push(fieldData)
                setFieldDataset((prevFieldDataset)=>({...prevFieldDataset,[field]:dataset}))
            }
            if(i+1 === urls.length){
                setLoadingAll(false)
            }
        })
    }

    function isIsoDate(str) {
        let date = str
        var dateParsed = new Date(date)
        
        try {
            let parsed = dateParsed.toISOString().split(':')
            let splitDate = date.split(':')
            parsed.pop()
            splitDate.pop()
            let newParsed = parsed.join(':')
            let fmtDate = splitDate.join(':')
            if(newParsed==fmtDate) {
                return true
            }
        } catch (error) {
            return false
        }
        return false
    }
    
    useEffect(()=>{
        Object.keys(selectedTableRow?.data).map((field,i)=>{
            if(Array.isArray(selectedTableRow?.data[field])){
                fetchDataFromApis(field,selectedTableRow?.data[field])
            }
        })
    },[selectedTableRow])

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
                let fieldIsImg = isImg(selectedTableRow?.data[field])
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
                if(Array.isArray(selectedTableRow?.data[field])){
                    return (!loadingAll && fieldDataset[field] && fieldDataset[field].length > 0) ? <React.Fragment key={i}>
                    <h4 className={classes.subDataContainerTitle}>
                        {field.replaceAll('_',' ').replace(/([A-Z]+)/g, ' $1').trim()}
                    </h4>
                    <div className={classes.subDataContainer}>
                        {fieldDataset[field]?.map((dataset,j)=><div 
                        className={classes.subDataItem}
                        key={j}>
                            {dataset && Object.keys(dataset).map((entry,k)=>Array.isArray(dataset[entry])? null 
                            : <div 
                            className={classes.detailFields}
                            key={k}>
                                <p>
                                    <span>
                                        {entry}
                                    </span>: {dataset[entry]}
                                </p>
                            </div>)}
                        </div>)}
                    </div>
                    </React.Fragment> : null
                }
                if(field!=='url' && isApi(selectedTableRow?.data[field])){
                    // getFieldDataset(selectedTableRow?.data[field])
                    return null
                }
                return <div 
                key={i}
                className={classes.detailFields}>
                    <p>
                        <span>
                            {field.replaceAll('_',' ').replace(/([A-Z]+)/g, ' $1').trim()}
                        </span>: {field === 'hash' ? 
                            `${selectedTableRow?.data[field].substring(0,3)}...` 
                            : isIsoDate(selectedTableRow?.data[field]) ?
                            new Date(selectedTableRow?.data[field]).toLocaleDateString()
                            : selectedTableRow?.data[field]}
                    </p>
                </div>
            })}
            </div>
            {loadingAll && <Loading />}
            {err.error && <ErrorFeedback
                msg={err.msg}
            />}
        </div>
    </div>
  )
}

export default RecordDetail