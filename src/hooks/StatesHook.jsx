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
    const [apiDisplayStatus, setApiDisplayStatus] = useState({
        star_wars:true,
        covid:false,
        cats:false
    })
    const [displayType, setDisplayType] = useState({
        table_view:true,
        gallery_view:false,
        accordion_view:false
    })

    const updateApiDisplayStatus = (displayStatus) => {
        setApiDisplayStatus(displayStatus)
    }

    const updateDisplayType = (disType)=>{
        setDisplayType(disType)
    }

    return (
        <StateContext.Provider value={{
            apiDisplayStatus,
            displayType
        }}>
            <StateUpdateContext.Provider value={{
                updateApiDisplayStatus,
                updateDisplayType
            }}>
                {children}
            </StateUpdateContext.Provider>
        </StateContext.Provider>
    )
}
