import { api } from "../utils/api";

const verify = async (credential) => {
  const apiRequest = api.fetchVerifyCredentialOnline;
  apiRequest.body = JSON.stringify(credential)
  const requestOptions = {
    method: apiRequest.methodType,
    headers: apiRequest.headers(),
    body: apiRequest.body,
  };

  try {
    const response = await fetch(apiRequest.url(),requestOptions);
    const data = await response.json();
    return data.verificationStatus
  } catch (error) {
    console.error("Error occurred:", error);
    throw new Error(error);
  }
};


export { verify };
