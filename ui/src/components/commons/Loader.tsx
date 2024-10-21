import React from "react";

function Loader(props: any) {
  return (
    <div
      id="loader"
      className={`bg-gradient p-[3px] w-[56px] lg:w-[76px] aspect-square rounded-[50%] animate-spin ${
        props.className ?? ""
      }`}
    >
      <div className="bg-white rounded-full w-full h-full" />
    </div>
  );
}

export default Loader;
