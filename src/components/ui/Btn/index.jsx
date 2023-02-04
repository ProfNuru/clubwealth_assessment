import React, { useEffect, useState } from 'react'

const Btn = ({
  text, 
  bgColor, 
  hoveredBgColor, 
  selectedDisplayType,
  btnAction
}) => {
  const [bg, setBg] = useState('')
  const [hovered, setHovered] = useState(false)

  const hoverOver = () => {
    setHovered(true)
  }
  const hoverOut = () => {
    setHovered(false)
  }

  useEffect(()=>{
    if(hovered || selectedDisplayType){
      setBg(hoveredBgColor)
    }else{
      setBg(bgColor)
    }
  },[hovered,selectedDisplayType])

  return (
    <button
    onClick={()=>btnAction(text)}
    onMouseEnter={hoverOver}
    onMouseLeave={hoverOut}
    style={{
      padding:'5px 15px',
      border:'none',
      fontWeight:'bolder',
      borderRadius:'5px',
      textTransform:'capitalize',
      backgroundColor:bg,
      cursor:'pointer',
      transition:'0.5s all'
    }}>{text.replace('_',' ')}</button>
  )
}

export default Btn