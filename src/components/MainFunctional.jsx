import React from "react"
import DropDownBtn from "./ui/DropDownBtn"
import classes from './MainFunctional.module.css'
import ToggleDisplayBtn from "./ui/ToggleDisplayBtn"
import DataComponent from "./DataComponent"

function MainFunctional() {
  // console.log(apiDisplayStatus)

  return (
    <main className={classes.main}>
      <div className={classes.displayControls}>
        <DropDownBtn />
        <ToggleDisplayBtn />
      </div>
      <div className={classes.dataView}>
        <DataComponent />
      </div>
    </main>
  );
}

export default MainFunctional;