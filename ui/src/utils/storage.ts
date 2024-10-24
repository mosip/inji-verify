import React from "react";

export class storage extends React.Component {
  static getItem = (key: string) => {
    let data = localStorage.getItem(key);
    if (data) {
      data = JSON.parse(data);
    }
    return data;
  };

  static setItem(key: string, value: any) {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}
