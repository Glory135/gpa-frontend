import React from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const EachCourse = ({ data, filter }) => {
  return (
    <div className="res-iten">
      <span className="code-item">{data.code}</span>
      <span className="grade-item">{data.grade}</span>
      <span className="unit-item">{data.unit}</span>
      <span className="action-item">
        {" "}
        <HighlightOffIcon onClick={()=>filter(data.id)} className="remove" />{" "}
      </span>
    </div>
  );
};

export default EachCourse;
