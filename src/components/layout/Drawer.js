import React, { useEffect, useState } from "react";
import classes from "./Drawer.module.css";
import DrawerContext from "../../store/DrawerContext";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

const Drawer = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);
  const navigate = useNavigate();

  const hideDrawerHandler = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(props.pathname);
    }, 500);
  };
  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen, hideDrawerHandler }}>
      <div className={`${classes.drawer} ${isOpen ? classes.open : " "} `}>
        <button className={classes.drawerButton} onClick={hideDrawerHandler}>
          <IonIcon className={classes.icon} icon={closeOutline} />
        </button>
        {props.children}
      </div>
    </DrawerContext.Provider>
  );
};

export default Drawer;
