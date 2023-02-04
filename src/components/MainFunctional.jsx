import React, { useState, useEffect } from "react"
import { useStatesContext } from "../hooks/StatesHook"
import DropDownBtn from "./ui/DropDownBtn"
import classes from './MainFunctional.module.css'
import ToggleDisplayBtn from "./ui/ToggleDisplayBtn"
import DataComponent from "./DataComponent"

function MainFunctional() {
  const { apiDisplayStatus } = useStatesContext()
  // console.log(apiDisplayStatus)

  return (
    <main className={classes.main}>
      <div className={classes.displayControls}>
        <DropDownBtn dropdownItems={apiDisplayStatus} />
        <ToggleDisplayBtn />
      </div>
      <div className={classes.dataView}>
        <DataComponent />
      </div>
    </main>
  );
}

export default MainFunctional;