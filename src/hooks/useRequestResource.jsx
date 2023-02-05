import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStatesContext } from './StatesHook'
import starwars from "../APIs/starwars"
import covid from "../APIs/covid"
import cats from "../APIs/cats"
import useLocalStorage from './useLocalStorage'

const useRequestResource = ({ dataset }) => {
    const [data, setData] = useState({
        star_wars:null,
        covid:null,
        cats:null
    })
    const [subCategories, setSubCategories] = useState({})
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
            return results
        } catch (error) {
            console.log(error)
            return error
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
                        // console.log('data fetched:', res)
                        setData((prevData)=>({...prevData, [api]:res}))
                    }
                } catch (error) {
                    console.log(error)
                }
                setLoading({...loading, [api]:false})
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
        })
    },[subCategories,subCategory,apiDisplayStatus])
    
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

    // Functions
    fetchData,
    chooseDataCategory
  }
}

export default useRequestResource