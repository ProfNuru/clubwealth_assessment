import React, { useContext, useEffect, useState } from "react"

const StateContext = React.createContext()
const StateUpdateContext = React.createContext()

export function useStatesContext(){
    return useContext(StateContext)
}

export function useUpdateStatesContext(){
    return useContext(StateUpdateContext)
}

export const StateProvider = ({ children }) => {
    const [dataFilters, setDataFilters] = useState([])
    const [searchFilter, setSearchFilter] = useState({
        star_wars:'',
        covid:'',
        cats:''
    })
    const [sortColumn, setSortColumn] = useState({
        star_wars:'',
        covid:'',
        cats:''
    })
    const [apiDisplayStatus, setApiDisplayStatus] = useState({
        star_wars:true,
        covid:false,
        cats:false
    })
    const [displayType, setDisplayType] = useState({
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
