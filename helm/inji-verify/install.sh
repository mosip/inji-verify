#!/bin/bash
# Installs inji-verify helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=injiverify
CHART_VERSION=0.0.1-develop

DEFAULT_MOSIP_INJIVERIFY_HOST=$( kubectl get cm global -n config-server -o jsonpath={.data.mosip-injiverify-host} )
# Check if MOSIP_INJIVERIFY_HOST is present under configmap/global of configserver
if echo "$DEFAULT_MOSIP_INJIVERIFY_HOST" | grep -q "MOSIP_INJIVERIFY_HOST"; then
    echo "MOSIP_INJIVERIFY_HOST is already present in configmap/global of configserver"
    MOSIP_INJIVERIFY_HOST=DEFAULT_MOSIP_INJIVERIFY_HOST
else
    read -p "Please provide injiverifyhost (eg: injiVERIFY.sandbox.xyz.net ) : " MOSIP_INJIVERIFY_HOST

    if [ -z "MOSIP_INJIVERIFY_HOST" ]; then
    echo "INJIVERIFY Host not provided; EXITING;"
    exit 0;
    fi    
fi   

CHK_MOSIP_INJIVERIFY_HOST=$( nslookup "$MOSIP_INJIVERIFY_HOST" )
if [ $? -gt 0 ]; then
    echo "InjiVERIFY Host does not exists; EXITING;"
    exit 0;
fi

echo "MOSIP_INJIVERIFY_HOST is not present in configmap/global of configserver"
    # Add injiverify host to global
    kubectl patch configmap global -n config-server --type merge -p "{\"data\": {\"mosip-injiverify-host\": \"$MOSIP_INIJIVERIFY_HOST\"}}"
    # Add the host
    kubectl set env deployment/config-server SPRING_CLOUD_CONFIG_SERVER_OVERRIDES_MOSIP_ESIGNET_INJIVERIFY_HOST=$MOSIP_INJIVERIFY_HOST -n config-server
    # Restart the configserver deployment
    kubectl -n config-server get deploy -o name | xargs -n1 -t kubectl -n config-server rollout restart 

echo Create $NS namespace
kubectl create ns $NS

function installing_inji-verify() {
  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite

  helm repo add mosip https://mosip.github.io/mosip-helm
  helm repo update

  echo Copy configmaps
  ./copy_cm.sh

  INJIVERIFY_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-injiverify-host})
  echo Installing INJIVERIFY
  helm -n $NS install inji-verify mosip/inji-verify \
  -f values.yaml \
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
