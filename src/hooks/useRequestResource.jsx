// Hook for API requests

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStatesContext } from './StatesHook'
import starwars from "../APIs/starwars"
import covid from "../APIs/covid"
import cats from "../APIs/cats"
import useLocalStorage from './useLocalStorage'

const useRequestResource = ({ dataset }) => {
    const [noInternet, setNoInternet] = useState(false)
    const [data, setData] = useState({
        star_wars:null,
        covid:null,
        cats:null
    })
    const [subCategories, setSubCategories] = useState({})
    const [selectedColumns, setSelectedColumns] = useLocalStorage('selectedColumns',{})
    const [subCategory, setSubCategory] = useLocalStorage('subCategory',{})
    const [loading, setLoading] = useState({
        star_wars:false,
        covid:false,
        cats:false
    })
    const apiObjects = {
        star_wars:starwars,
        covid:covid,
        cats:cats
    }

    const { apiDisplayStatus } = useStatesContext()
    
    // Initial fetch dataset
    const fetchDataset = useCallback(async (fetchFxn) => {
        try {
            const results = await fetchFxn()
            if(results.toString()==="AxiosError: Network Error"){
                setNoInternet(true)
                return null
            }
            setNoInternet(false)
            return results
        } catch (error) {
            console.log(error)
            return null
        }
    },[subCategory])

    const fetchData = useCallback(()=>{
        if(dataset){
            dataset.forEach(async api=>{
                if(!Object.keys(data).includes(api)){
                    setData((prevData)=>({...prevData, [api]:null}))
                }
                try {
                    setLoading({...loading,[api]:true})
                    if(apiObjects[api][subCategory[api]]){
                        const res = await fetchDataset(apiObjects[api][subCategory[api]])
                        setLoading({...loading, [api]:false})
                        if(res){
                            setData((prevData)=>({...prevData, [api]:res}))
                        }
                    }
                } catch (error) {
                    setNoInternet(true)
                    setLoading({...loading, [api]:false})
                }
                // console.log('loading stopped')
            })
        }
    },[subCategory, dataset])

    const chooseDataCategory = (api, ctg)=>{
        setSubCategory({...subCategory, [api]:ctg})
    }

    useEffect(()=>{
        if(dataset){
            let subCats = {}
            dataset.forEach((api,_)=>{
                // Initialize categories
                const categories = Object.keys(apiObjects[api])
                subCats[api] = categories
                setSubCategories(subCats)
            })
        }
    },[dataset])

    useEffect(()=>{
        if(Object.keys(subCategory).length <= 0){
            Object.keys(apiObjects).forEach(api=>{
                if(subCategories[api]){
                    setSubCategory((prevSubCategories)=>({...prevSubCategories,[api]:subCategories[api][0]}))
                }
            })
        }
        Object.keys(apiDisplayStatus).forEach(api=>{
            if(subCategories[api] && !subCategory[api]){
                setSubCategory((prevSubCategories)=>({...prevSubCategories,[api]:subCategories[api][0]}))
            }
            if(data[api] && !selectedColumns[api]){
                setSelectedColumns((prevSelectedColumns)=>({...prevSelectedColumns,[api]:Object.keys(data[api][0])}))
            }
        })
    },[subCategories,subCategory,apiDisplayStatus,selectedColumns, data])
    
    useEffect(()=>{
        // console.log(subCategory)
        fetchData()
    },[subCategory, dataset])

  return {
    // Objects
    loading,
    subCategories,
    data,
    subCategory,
    selectedColumns,
    noInternet,

    // Functions
    fetchData,
    chooseDataCategory,
    setSelectedColumns
  }
}

export default useRequestResource