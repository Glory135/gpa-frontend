import React from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const TopBar = ({ darkmode, setDarkmode }) => {
  return (
    <div className="topBar">
      <span className="logo">
        <span className="first">GPA</span> <span className="second">Calculator</span>
      </span>
      <span className="mode">
        <DarkModeIcon
          onClick={() => setDarkmode(!darkmode)}
          style={{ color: darkmode ? "white" : "rgb(71, 71, 71)" }}
          className="darkmode"
        />
      </span>
    </div>
  );
};

export default TopBar;
