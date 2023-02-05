import React, { useContext, useEffect, useState } from "react"
import useLocalStorage from './useLocalStorage'

const StateContext = React.createContext()
const StateUpdateContext = React.createContext()

export function useStatesContext(){
    return useContext(StateContext)
}

export function useUpdateStatesContext(){
    return useContext(StateUpdateContext)
}

export const StateProvider = ({ children }) => {
    const [dataFilters, setDataFilters] = useLocalStorage('dataFilters',[])
    const [searchFilter, setSearchFilter] = useState({
        star_wars:'',
        covid:'',
        cats:''
    })
    const [sortColumn, setSortColumn] = useLocalStorage('sortColumn',{
        star_wars:'',
        covid:'',
        cats:''
    })
    const [apiDisplayStatus, setApiDisplayStatus] = useLocalStorage('apiDisplayStatus',{
        star_wars:true,
        covid:false,
        cats:false
    })
    const [displayType, setDisplayType] = useLocalStorage('displayType',{
        table_view:true,
    })

    const updateApiDisplayStatus = (displayStatus) => {
        setApiDisplayStatus(displayStatus)
    }

    const updateDisplayType = (disType)=>{
        setDisplayType(disType)
    }
    
    const setSearchTerm = (lbl,term) => {
        setSearchFilter({...searchFilter,[lbl]:term})
    }

    const updateFilters = (record) => {
        setDataFilters([...dataFilters,record])
    }

    const setSortBy = (column,value) => {
        setSortColumn({...sortColumn,[column]:value})
    }

    return (
        <StateContext.Provider value={{
            apiDisplayStatus,
            displayType,
            searchFilter,
            dataFilters,
            sortColumn
        }}>
            <StateUpdateContext.Provider value={{
                updateApiDisplayStatus,
                updateDisplayType,
                setSearchTerm,
                updateFilters,
                setSortBy
            }}>
                {children}
            </StateUpdateContext.Provider>
        </StateContext.Provider>
    )
}
