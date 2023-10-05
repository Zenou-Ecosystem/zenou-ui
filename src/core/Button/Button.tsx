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
    <button
      id={id ?? ""}
      className={`btn-comp z-10 border-none fixed bottom-5 right-3 md:bottom-0 md:right-0 md:relative flex gap-2 items-center rounded-md text-white font-medium ${
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
  );
}

export default Button;
