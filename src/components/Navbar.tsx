import { FC } from "react";
import { NavLink } from "react-router-dom";

export const NavBar: FC = () => {
  return (
    <div className="flex justify-around p-2 bg-purple-600 text-white">
      <NavLink
        to="/"
        exact
        className="underline"
        activeClassName="no-underline font-bold"
      >
        Home
      </NavLink>

      <NavLink
        to="/editor"
        className="underline"
        activeClassName="no-underline font-bold"
      >
        Editor
      </NavLink>
    </div>
  );
};
