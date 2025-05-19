export const vcVerification = async (credential: unknown, url: string) => {
  const body = JSON.stringify(credential);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  try {
    const response = await fetch(url + "/vc-verification", requestOptions);
    const data = await response.json();
    return data.verificationStatus;
  } catch (error) {
    console.error("Error occurred:", error);
    if (error instanceof Error) {
      throw Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const vcSubmission = async (credential: unknown, url: string) => {
  const body = JSON.stringify(credential);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  try {
    const response = await fetch(url + "/vc-submission", requestOptions);
    const data = await response.json();
    return data.transactionId;
  } catch (error) {
    console.error("Error occurred:", error);
    if (error instanceof Error) {
      throw Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
