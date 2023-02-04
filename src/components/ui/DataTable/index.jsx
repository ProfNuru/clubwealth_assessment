import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import classes from './DataTable.module.css'
import moment from 'moment'
import PageCell from '../PageCell'
import useRequestResource from '../../../hooks/useRequestResource'
import { useStatesContext } from '../../../hooks/StatesHook'
import { useUpdateStatesContext } from '../../../hooks/StatesHook'


const DataTable = () => {
  const [apiToFetch, setApiToFetch] = useState([])
  const [paginatedData, setPaginatedData] = useState({})
  const [pageSize, setPageSize] = useState({})
  const [page, setPage] = useState({})
  const [tableRowEvents, setTableRowEvents] = useState({})
  const [selectedTableRow, setSelectedTableRow] = useState(null)
  const [showDetailsModal,setShowDetailsModal] = useState(false)

  const { 
    apiDisplayStatus,
    searchFilter,
    dataFilters
  } = useStatesContext()

  const {
    setSearchTerm,
    updateFilters
  } = useUpdateStatesContext()

  const dateFormats = [
      moment.ISO_8601,
      "MM/DD/YYYY  :)  HH*mm*ss"
  ];

  const { 
    data, 
    subCategory,
    subCategories,
    loading,
    fetchData,
    chooseDataCategory } = useRequestResource({dataset:apiToFetch})
  
  const selectCategory = (lbl,selection) => {
    chooseDataCategory(lbl, selection)
    // fetchData()
  }

  const getCleanValue = (value) => {
    let cleanedVal = !isNaN(value) ? formatNumberString(value) : moment(value, dateFormats, true).isValid() ? 
                      new Date(value).toLocaleDateString() : value
    // console.log(value, isNaN(value))
    return cleanedVal === "Invalid Date" ? value : cleanedVal 
  }

  const switchPage = (lbl,num)=>{
    setPage({...page,[lbl]:num})
  }

  const viewRecordDetails = (api, row) => {
    setSelectedTableRow({api,data:row})
    setShowDetailsModal(true)
  }

  const closeModal = () => {
    setShowDetailsModal(false)
    setSelectedTableRow(null)
  }

  const filterOutRecord = (record) => {
    setShowDetailsModal(false)
    updateFilters(record)
  }

  function formatNumberString(string){
    let formatted = !isNaN(string) ?
                new Intl.NumberFormat('en').format(parseFloat(string))
                : string
    return formatted
  }

  function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  useEffect(()=>{
    fetchData()
  },[apiToFetch])

  useEffect(()=>{
    let apis = []
    let iObj = {}
    Object.keys(apiDisplayStatus).forEach((api,i)=>{
      if(apiDisplayStatus[api]){
        apis.push(api)
        iObj[api] = 0
      }
    })
    setTableRowEvents(iObj)
    setApiToFetch(apis)
  },[apiDisplayStatus])

  useEffect(()=>{
    let paginatedDataObj = {}
    let pageSizeObj = {}
    let pageObj = {}
    apiToFetch.forEach((api)=>{
      pageSizeObj[api] = pageSize[api] ? pageSize[api] : 10
      pageObj[api] = 1
      if(data[api]){
        let chunks = []
        let searchLogic = (row)=>JSON.stringify(row).toLowerCase().search(searchFilter[api].toLowerCase()) > -1
        let filterLogic = (row)=>{
          for(let i=0; i<dataFilters.length; i++){
            if(JSON.stringify(dataFilters[i])===JSON.stringify(row)){
              return false
            }
          }
          return true
        }
        let searchedData = data[api].filter((dta)=>searchLogic(dta))
                                    .filter((rec)=>filterLogic(rec))

        for (let i = 0; i < searchedData.length; i += pageSizeObj[api]) {
          const chunk = searchedData.slice(i, i + pageSizeObj[api]);
          chunks.push(chunk)
        }
        paginatedDataObj[api] = chunks
      }
    })
    setPaginatedData(paginatedDataObj)
    setPageSize(pageSizeObj)
    setPage(pageObj)
  },[
    apiToFetch, 
    data, 
    searchFilter,
    dataFilters
  ])

  return (
    <>
      {showDetailsModal && <div className={classes.recordModal}>
        <div className={classes.modalContent}>
          <button 
          onClick={closeModal}
          className={classes.closeBtn}>x</button>
          <h1>{selectedTableRow?.api.replace('_',' ')}</h1>
          <h2>{subCategory[selectedTableRow?.api].substring(3).replace(/([A-Z]+)/g, ' $1').trim()}</h2>
          <button 
          onClick={()=>filterOutRecord(selectedTableRow?.data)}
          className={classes.removeEntryBtn}>Remove this record</button>
          
          <div className={classes.detailsGrid}>
            {Object.keys(selectedTableRow?.data).map((field,i)=><div 
            key={i}
            className={classes.detailFields}>
              <p><span>{field.replaceAll('_',' ').replace(/([A-Z]+)/g, ' $1').trim()}</span>: {selectedTableRow?.data[field]}</p>
            </div>)}
          </div>
        </div>
      </div>}

      {apiToFetch?.map((label)=><div key={label}
      className={classes.tableWrapper}>
        {/* Title */}
        <h1 className={classes.tableHeading}>
          {label.replace('_',' ')}
        </h1>

        {/* Categories */}
        <div className={classes.dataCategories}>
          {subCategories[label]?.map((ctg,i)=><div 
          key={i} className={classes.categoryOption}>
            <label htmlFor={ctg}>{ctg.substring(3).replace(/([A-Z]+)/g, ' $1').trim()}</label>
            <input
              type="radio"
              id={ctg}
              name={`${label}_categories`}
              checked={ctg===subCategory[label]}
              onChange={(e)=>selectCategory(label,ctg)}
            />
          </div>)}   
        </div>

        {/* Search field */}
        <div className={classes.searchFormField}>
          <input 
          type="text" 
          value={searchFilter[label]}
          onChange={(e)=>setSearchTerm(label, e.target.value)}
          placeholder={`Search ${label.replace('_',' ')}`}
          />
        </div>

        {/* Table */}
        {loading[label] && <Loading />}

        <div className={classes.tableGrid} style={{
          gridTemplateColumns:`repeat(${data[label] ? 
            Object.keys(data[label][0]).length : 0},1fr)`,
        }}>
          {/* Column heads */}
          {data[label] && Object.keys(data[label][0])?.map((col,i)=><div
          key={col}
          style={{
            backgroundColor:'var(--btn-bg)',
            color:'#eee',
            borderBottom:'1px solid #999',
            borderRight:'1px solid #999',
            borderLeft:'1px solid #999',
            textTransform:'capitalize',
            fontWeight:'bolder',
            display:'flex',
            justifyContent:'center',
            alignItems:'flex-start',
            textAlign:'center',
            padding:'5px'
          }}>{col.replaceAll('_',' ').replace(/([A-Z]+)/g, ' $1').trim()}</div>)}

          {/* Table data */}
          {(paginatedData[label] && paginatedData[label][page[label]-1]) && 
          paginatedData[label][page[label]-1].map((row,i)=><React.Fragment key={i}>
            {Object.keys(row).map((record)=><div
            onMouseEnter={()=>setTableRowEvents({...tableRowEvents,[label]:i+1})}
            onMouseLeave={()=>setTableRowEvents({...tableRowEvents,[label]:0})}
            onClick={()=>viewRecordDetails(label,row)}
            key={record}
            style={{
              backgroundColor: tableRowEvents[label] === i+1 ? '#033BAB' : '#fff',
              color: tableRowEvents[label] === i+1 ? '#fff' : '#000',
              borderBottom:'1px solid #eee',
              borderRight:'1px solid #eee',
              borderLeft:'1px solid #eee',
              textTransform:'capitalize',
              fontWeight:'bolder',
              display:'flex',
              justifyContent:!isNaN(row[record]) && !Array.isArray(row[record]) ? 'flex-end' : 'center',
              alignItems:'center',
              textAlign: 'center',
              padding:'5px'
            }}>
              {Array.isArray(row[record]) ? record :
              isValidHttpUrl(row[record]) ? 'View' 
              : getCleanValue(row[record])}
            </div>)}
          </React.Fragment>)}
        </div>
        <div className={classes.pagesField}>
          {Array.from({length:paginatedData[label] ? paginatedData[label].length : 0}).map((_,i)=>{
            return (
              <PageCell
              switchPage={switchPage}
              label={label}
              number={i+1}
              currentPage={page[label] ? page[label] === i+1 : false}
              key={i}
              />
            )
          })}
        </div>
      </div>)}
    </>
  )
}

export default DataTable