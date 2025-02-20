import React from "react";
import LoadingCircle from "../../assets/loading_circle.svg";

function Loader(props: any) {
  return (
    <div id="loader">
      <img
        src={LoadingCircle}
        className={`${props.className} animate-spin m-auto`}
      />
    </div>
  );
}

export default Loader;
