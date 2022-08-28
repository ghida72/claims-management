import { createContext } from "react";

const DrawerContext = createContext({
  isOpen: true,
  setIsOpen: () => {},
  tryCloseDrawer: () => {},
  showPrompt: false,
  setShowPrompt: () => {},
});

export default DrawerContext;
