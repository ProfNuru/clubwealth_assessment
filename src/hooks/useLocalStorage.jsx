// Hook for setting and getting data from localStorage
// Usage: const [value, setValue] = useLocalStorage([key], [initialValue])

import React, { useEffect, useState } from 'react'

function getSavedValue(key,initialValue){
    const savedValue = JSON.parse(localStorage.getItem(key))
    if(savedValue) return savedValue
    if(initialValue instanceof Function) return initialValue()
    return initialValue
}

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(()=>{
    return getSavedValue(key, initialValue)
  })

  useEffect(()=>{
    localStorage.setItem(key,JSON.stringify(value))
  },[value])

  return [value, setValue]
}

export default useLocalStorage