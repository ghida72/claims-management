import { Fragment } from "react";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";

const Layout = (props) => {
  return (
    <Fragment>
      <MainNavigation />
      {props.children}
      <Footer />
    </Fragment>
  );
};

export default Layout;
