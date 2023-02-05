import React, { useEffect, useState } from 'react'
import classes from './DropDownBtn.module.css'
import { useStatesContext, useUpdateStatesContext } from '../../../hooks/StatesHook'

const DropDownBtn = () => {
    const [showDropdown, setShowDropdown] = useState(false)
    const [items, setItems] = useState(null)
    const [itemsList, setItemsList] = useState([])
    const { apiDisplayStatus } = useStatesContext()
    const {updateApiDisplayStatus} = useUpdateStatesContext()
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const toggleItem = (item) => {
        const displayStatus = {...items}
        displayStatus[item] = !items[item]
        updateApiDisplayStatus(displayStatus)
    }

    useEffect(()=>{
        setItems(apiDisplayStatus)
        setItemsList(Object.keys(apiDisplayStatus))
    },[apiDisplayStatus])

  return (
    <div className={classes.button}>
        <button
        onClick={toggleDropdown}
        className={classes.dropdownBtn}>
            Select API
        </button>
        {showDropdown && <ul className={classes.dropdown}>
            {itemsList?.map((item,i)=><li key={i}>
                <label htmlFor={item}>{item.replace('_',' ')}</label>
                <input 
                type="checkbox" 
                id={item}
                checked={items[item]}
                onChange={()=>toggleItem(item)}
                />
            </li>)}
        </ul>}
    </div>
  )
}

export default DropDownBtn