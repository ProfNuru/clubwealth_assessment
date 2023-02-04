import React, { useEffect, useState } from 'react'
import { useStatesContext, useUpdateStatesContext } from '../../../hooks/StatesHook'
import Btn from '../Btn'
import classes from './ToggleDisplayBtn.module.css'

const ToggleDisplayBtn = () => {
  const [displayTypes, setDisplayTypes] = useState([])
  const { displayType } = useStatesContext()
  const { updateDisplayType } = useUpdateStatesContext()

  const toggleDisplay = (txt) => {
    const displayObject = {}
    for(let i=0; i<displayTypes.length; i++){
      if(txt === displayTypes[i]){
        displayObject[txt] = true
      }else{
        displayObject[displayTypes[i]] = false
      }
    }
    updateDisplayType(displayObject)
  }

  useEffect(()=>{
    setDisplayTypes(Object.keys(displayType))
  },[displayType])

  return (
    <div className={classes.toggleDisplayGroup}>
      {displayTypes?.map((view,i)=><div key={i}
      className={classes.toggleDisplay}>
        <Btn
          selectedDisplayType={displayType[view]}
          btnAction={toggleDisplay}
          text={view}
          bgColor="#999"
          hoveredBgColor="#033BAB"
        />
      </div>)}
    </div>
  )
}

export default ToggleDisplayBtn