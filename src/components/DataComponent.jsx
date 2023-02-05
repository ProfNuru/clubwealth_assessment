import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useStatesContext } from '../hooks/StatesHook'

const TableView = lazy(() => import('./displays/TableView'))
const GalleryView = lazy(() => import('./displays/GalleryView'))
const AccordionView = lazy(() => import('./displays/AccordionView'))

const DataComponent = () => {
  const [selectedDisplayType, setSelectedDisplayType] = useState(null)
  const [apiToFetch, setApiToFetch] = useState(null)
  const { displayType, apiDisplayStatus } = useStatesContext()

  useEffect(()=>{
    let apis = []
    Object.keys(apiDisplayStatus).forEach((api,i)=>{
      if(apiDisplayStatus[api]){
        apis.push(api)
      }
    })
    setApiToFetch(apis)
  },[apiDisplayStatus])

  // I was going to implement 3 display views.
  // But I only had time to implement the table view.
  // Will come back to this

  // useEffect(()=>{
  //   Object.keys(displayType).forEach((view,i)=>{
  //     if(displayType[view]){
  //       if(view === 'table_view'){
  //         setSelectedDisplayType(<TableView />)
  //       }
  //       if(view === 'gallery_view'){
  //         setSelectedDisplayType(<GalleryView />)
  //       }
  //       if(view === 'accordion_view'){
  //         setSelectedDisplayType(<AccordionView />)
  //       }
  //     }
  //   })
  // },[displayType,apiToFetch])

  return (
    <Suspense fallback={<h5>Loading</h5>}>
      <ul>
        <li style={{
          color:'#000'
        }}>Click the button above to select data</li>
        <li style={{
          color:'#000'
        }}>Click the columns in the table to filter by that column</li>
        <li style={{
          color:'#000'
        }}>Click a row to view details of that record</li>
        <li style={{
          color:'#000'
        }}>Click a 'Choose columns to show button' and select which columns you want to display</li>
      </ul>
      <TableView />
    </Suspense>
  )
}

export default DataComponent
