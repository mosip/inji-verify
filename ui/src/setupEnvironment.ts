if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.assert = () => {};
}

export {};
