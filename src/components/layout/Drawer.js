import React, { useEffect, useState } from "react";
import classes from "./Drawer.module.css";
import DrawerContext from "../../store/DrawerContext";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import prompt from "../../helpers/promptHelper";
import { CPT_PROMPT_MESSAGE } from "../../constants";

const Drawer = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  /*
  setShowPrompt is passed to the child component through the context provider to determine 
  when the drawer can be closed with or without displaying a prompt (ex: when a form is dirty).
  */
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    //Set isOpen to true once the component is mounted which will trigger the transition effect (slide-in)
    setIsOpen(true);
  }, []);

  const hideDrawerHandler = () => {
    setIsOpen(false);
    setShowPrompt(false);
    if (props.postCloseHandler) {
      /*
      wait until the transition effect completes, and then invoke whatever behavior is requested 
      by the caller (ex: navigate to another route)
      */
      setTimeout(() => {
        props.postCloseHandler();
      }, 500);
    }
  };

  const tryCloseDrawer = () => {
    if (showPrompt) {
      prompt(CPT_PROMPT_MESSAGE, hideDrawerHandler);
    } else {
      hideDrawerHandler();
    }
  };

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        setIsOpen,
        tryCloseDrawer,
        showPrompt,
        setShowPrompt,
      }}
    >
      <div className={`${classes.drawer} ${isOpen ? classes.open : " "} `}>
        <button className={classes.drawerButton} onClick={tryCloseDrawer}>
          <IonIcon className={classes.icon} icon={closeOutline} />
        </button>
        {props.children}
      </div>
    </DrawerContext.Provider>
  );
};

export default Drawer;
