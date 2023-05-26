import React from "react";
import "./card.scss";

function BasicCard(props: {
  title: string;
  content: string | Function;
  styles?: string;
  headerStyles?: string;
}) {
  const { title, content, styles, headerStyles } = props;

  return (
    <div className={`container rounded border ${styles ? styles : ""}`}>
      <div className="card-header">
        <h1
          className={`font-bold text-primary ${
            headerStyles ? headerStyles : ""
          }`}
        >
          {title}
        </h1>
      </div>
      <div className="card-content">
        <div className="text-center card-body">
          {typeof content == "string" ? content : content()}
        </div>
      </div>
    </div>
  );
}

export default BasicCard;
