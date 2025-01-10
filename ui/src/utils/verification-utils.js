const verify = async (credential) => {
  return await verifyCredentialOnline(credential);
};

const verifyCredentialOnline = (credential) => {
  return new Promise(function (resolve, reject) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${window._env_.VERIFY_SERVICE_API_URL}/vc-verification`, true);
    xhttp.onload = function () {
      var status = xhttp.status;
      if (status === 200) {
        resolve(JSON.parse(xhttp.response));
      } else {
        reject(status);
      }
    };
    xhttp.send(JSON.stringify(credential));
  });
}

export { verify };
