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

  useEffect(()=>{
    Object.keys(displayType).forEach((view,i)=>{
      if(displayType[view]){
        if(view === 'table_view'){
          setSelectedDisplayType(<TableView />)
        }
        if(view === 'gallery_view'){
          setSelectedDisplayType(<GalleryView />)
        }
        if(view === 'accordion_view'){
          setSelectedDisplayType(<AccordionView />)
        }
      }
    })
  },[displayType,apiToFetch])

  return (
    <Suspense fallback={<h5>Loading</h5>}>
      {selectedDisplayType}
    </Suspense>
  )
}

export default DataComponent

/*
import React, { useState, useEffect } from "react";
import starwars from "../APIs/starwars";

function MainFunctional() {
  const [data, setData] = useState([]);

  useEffect(() => {
    starwars.getPeople().then((response) => {
      console.log("response", response);
      setData(response);
    });
  }, []);

  return (
    <div className="App">
      {data.map((item, index) => {
        return <div key={index}>name: {item.name}</div>;
      })}
    </div>
  );
}

export default MainFunctional;
*/