import { createContext } from "react";

const DrawerContext = createContext({
  isOpen: true,
  setIsOpen: () => {},
  hideDrawerHandler: () => {},
});

export default DrawerContext;
