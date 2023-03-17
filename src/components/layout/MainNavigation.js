import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink
              to="/claims"
              className={(navData) => (navData.isActive ? classes.active : "")}
            >
              Claims
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={(navData) => (navData.isActive ? classes.active : "")}
            >
              Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
