import React from "react";
import "./button.scss";

function Button(prop: {
  title: string;
  onClick: Function;
  Icon?: any;
  styles?: string;
  id?: string;
}) {
  const { Icon, title, styles, id, onClick } = prop;

  const handler = (e: any) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div className="relative">
      <button
        id={id ?? ""}
        className={`btn-comp border-none flex gap-2 items-center rounded-md text-white font-medium ${
          styles ? styles : ""
        }`}
        onClick={handler}
      >
        <span>{title}</span>
        {Icon ? (
          <span className={Icon.classes}>
            <Icon.Name size={Icon.size ?? 22} color={Icon.color ?? "black"} />
          </span>
        ) : null}
      </button>
    </div>
  );
}

export default Button;
