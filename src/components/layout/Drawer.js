import React, { useEffect, useState } from "react";
import classes from "./Drawer.module.css";
import DrawerContext from "../../store/DrawerContext";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import prompt from "../../helpers/promptHelper";
import { CPT_PROMPT_MESSAGE } from "../../constants";

const Drawer = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const tryCloseDrawer = () => {
    if (showPrompt) {
      prompt(CPT_PROMPT_MESSAGE, hideDrawerHandler);
    } else {
      hideDrawerHandler();
    }
  };

  const hideDrawerHandler = () => {
    setIsOpen(false);
    setShowPrompt(false);
    if (props.postCloseHandler) {
      setTimeout(() => {
        props.postCloseHandler();
      }, 500);
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
