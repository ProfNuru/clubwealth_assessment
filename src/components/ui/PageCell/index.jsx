import React, { useEffect, useState } from 'react'

const PageCell = ({switchPage, label, number, currentPage}) => {
    const [bgColor, setBgColor] = useState('#fff')
    const [txtColor, setTxtColor] = useState('var(--btn-bg)')
    // console.log(currentPage)
    useEffect(()=>{
        if(currentPage){
            setBgColor('var(--btn-bg)')
            setTxtColor('#fff')
        }else{
            setBgColor('#fff')
            setTxtColor('var(--btn-bg)')
        }
    },[currentPage])

  return (
    <div
    onClick={()=>switchPage(label,number)}
    onMouseEnter={()=>{
        setBgColor('var(--btn-bg)')
        setTxtColor('#fff')
    }}
    onMouseLeave={()=>{
        if(!currentPage){
            setBgColor('#fff')
            setTxtColor('var(--btn-bg)')
        }
    }}
    style={{
        color:txtColor,
        fontSize:'1.2em',
        padding:'10px',
        borderRadius:'10px',
        backgroundColor:bgColor,
        border:'1px solid var(--btn-bg)',
        fontWeight:'bolder',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        width:'40px',
        height:'40px',
        cursor:'pointer',
    }}
    >{number}</div>
  )
}

export default PageCell