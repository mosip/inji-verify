import React from "react";

export const renderGradientText = (title: string) => {
  return (
    <span className="bg-gradient bg-clip-text text-transparent text-md font-bold">
      {title}
    </span>
  );
};
