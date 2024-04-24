#!/bin/bash
# Installs inji-verify helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=injiverify
CHART_VERSION=0.0.1-develop

echo Create $NS namespace
kubectl create ns $NS

function ensure_injiverify_host() {
  # Check if mosip-injiverify-host is present in global config map of config-server
  if ! kubectl get cm config-server -n $NS -o jsonpath='{.data}' | grep -q 'mosip-injiverify-host'; then
    echo "Adding mosip-injiverify-host to config-server global config map"
    kubectl patch configmap config-server -n $NS --type json -p '[{"op": "add", "path": "/data/mosip-injiverify-host", "value": "injiverify.sandbox.xyz.net"}]'
    # Restart config-server
    kubectl rollout restart deployment config-server -n $NS
  else
    echo "mosip-injiverify-host already present in config-server global config map"
  fi
}

function installing_inji-verify() {
  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite

  helm repo add mosip https://mosip.github.io/mosip-helm
  helm repo update

  echo Copy configmaps
  ./copy_cm.sh

  INJI_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-injiverify-host})
  echo Installing INJIWEB
  helm -n $NS install inji-verify mosip/inji-verify \
  -f values.yaml \
  --set esignet_redirect_url=$ESIGNET_HOST \
  --set istio.hosts\[0\]=$INJIVERIFY_HOST \
  --version $CHART_VERSION

  kubectl -n $NS  get deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed inji-verify
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_inji-verify   # calling function
