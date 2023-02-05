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
  const [showColumnOptions, setShowColumnOptions] = useState({
    api:'',
    show:false
  })

  const { 
    apiDisplayStatus,
    searchFilter,
    dataFilters,
    sortColumn
  } = useStatesContext()

  const {
    setSearchTerm,
    updateFilters,
    setSortBy
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
    selectedColumns,
    setSelectedColumns,
    fetchData,
    chooseDataCategory } = useRequestResource({dataset:apiToFetch})
  console.log(data)
  
  const selectCategory = (lbl,selection) => {
    chooseDataCategory(lbl, selection)
    // fetchData()
  }

  const getCleanValue = (value, col) => {
    let cleanedVal = !isNaN(value) ? formatNumberString(value,col) : moment(value, dateFormats, true).isValid() ? 
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

  // Logic for sorting objects by key
  const sortData = (objs, objKey) => {
    function dynamicSort(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          /* next line works with strings and numbers, 
           * and you may want to customize it to your needs
           */
          let first_value = isNaN(a[property]) ? a[property] : parseFloat(a[property])
          let second_value = isNaN(b[property]) ? b[property] : parseFloat(b[property])
          
          var result = (first_value < second_value) ? -1 
          : (first_value > second_value) ? 1 : 0;
          return result * sortOrder;
      }
    }
    let objArr
    if(objs){
      objArr = [...objs]
      objArr.sort(dynamicSort(objKey))
    }
    return objArr
  }

  const filterOutRecord = (record) => {
    setShowDetailsModal(false)
    updateFilters(record)
  }

  const sortBy = (col,value)=>{
    setSortBy(col,value)
  }

  const columnSelected = (col, lbl, include) => {
    let filteredCols = include ? [...selectedColumns[lbl], col] : selectedColumns[lbl].filter((c)=>c!==col)
    setSelectedColumns({...selectedColumns, [lbl]:filteredCols})
  }

  const includeAllColumns = (lbl, include) => {
    let filteredCols = include ? Object.keys(data[lbl][0]) : []
    setSelectedColumns({...selectedColumns, [lbl]:filteredCols})
  }

  const cherryPickColumns = (obj, includedColumns) => {
    // console.log(obj, includedColumns)
    let currentSet = new Set(includedColumns)
    let excludedCols = Object.keys(obj).filter(x => !currentSet.has(x))
    let updatedObj = obj
    excludedCols.forEach((c)=>{
      const {[c]:omitted, ...rest} = updatedObj
      updatedObj = rest
    })
    return updatedObj
  }

  function formatNumberString(string,col){
    let formatted = col==='date' ? string : !isNaN(string) ?
                string===null ? "-" : new Intl.NumberFormat('en').format(parseFloat(string))
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
        let searchedData = sortData(data[api],sortColumn[api])
                                    .filter((dta)=>searchLogic(dta))
                                    .filter((rec)=>filterLogic(rec))
                                    .map((obj)=>{
                                      cherryPickColumns(obj,selectedColumns[api])
                                      return cherryPickColumns(obj,selectedColumns[api])
                                    })

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
    dataFilters,
    sortColumn,
    selectedColumns
  ])

  return (
    <>
      {/* Details modal */}
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
          <small style={{color:'#000',padding:'0px 10px'}}>This removes this record from the table</small>
          
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

          <div className={classes.selectColumnsOptions}>
            <button 
            onClick={()=>setShowColumnOptions({api:label, show:!showColumnOptions.show})}
            className={classes.toggleColumnsOptions}>
              Choose columns to show
            </button>

            {(showColumnOptions.api===label && showColumnOptions.show) && <div className={classes.columnsOptions}>
              <div
              className={classes.columnOption}>
                <label htmlFor='all'>
                  All
                </label>
                <input 
                type="checkbox" 
                id="all"
                checked={data[label] ? selectedColumns[label].length === Object.keys(data[label][0]).length : false}
                onChange={(e)=>includeAllColumns(label,e.target.checked)}
                />
              </div>
              {data[label] && Object.keys(data[label][0])?.map((col,i)=><div
              key={i}
              className={classes.columnOption}>
                <label htmlFor={col}>
                  {col.replaceAll('_',' ').replace(/([A-Z]+)/g, ' $1').trim()}
                </label>
                <input 
                type="checkbox" 
                id={col}
                checked={selectedColumns[label].includes(col)}
                onChange={(e)=>columnSelected(col, label, e.target.checked)}
                />
              </div>)}
            </div>}
          </div>
        </div>

        {/* Table */}
        {loading[label] && <Loading />}

        <div className={classes.tableGrid} style={{
          gridTemplateColumns:`repeat(${paginatedData[label] && paginatedData[label][0] ? 
            Object.keys(paginatedData[label][0][0]).length : 0},1fr)`,
        }}>
          {/* Column heads */}
          {(paginatedData[label] && paginatedData[label][0]) && Object.keys(paginatedData[label][0][0])?.map((col,i)=><div
          onClick={()=>sortBy(label,col)}
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
              justifyContent:(row[record]!==null && !isNaN(row[record]) && !Array.isArray(row[record])) ? 'flex-end' : 'center',
              alignItems:'center',
              textAlign: 'center',
              padding:'5px'
            }}>
              {record === 'hash' ? `${row[record].substring(0,3)}...` : Array.isArray(row[record]) ? record :
              isValidHttpUrl(row[record]) ? 'View' 
              : getCleanValue(row[record],record)}
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