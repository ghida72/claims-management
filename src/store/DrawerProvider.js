import { useState } from "react";
import DrawerContext from "./DrawerContext";

const DrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

export default DrawerProvider;
