#!/bin/bash
## Installs inji-verify-ui helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=injiverify
CHART_VERSION=0.11.0

DEFAULT_MOSIP_INJIVERIFY_HOST=$( kubectl get cm global -n config-server -o jsonpath={.data.mosip-injiverify-host} )
# Check if MOSIP_INJIVERIFY_HOST is present under configmap/global of configserver
if echo "$DEFAULT_MOSIP_INJIVERIFY_HOST" | grep -q "MOSIP_INJIVERIFY_HOST"; then
    echo "MOSIP_INJIVERIFY_HOST is already present in configmap/global of configserver"
    MOSIP_INJIVERIFY_HOST=DEFAULT_MOSIP_INJIVERIFY_HOST
else
    read -p "Please provide injiverifyhost (eg: injiverify.sandbox.xyz.net ) : " MOSIP_INJIVERIFY_HOST

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
    kubectl patch configmap global -n config-server --type merge -p "{\"data\": {\"mosip-injiverify-host\": \"$MOSIP_INJIVERIFY_HOST\"}}"
    kubectl patch configmap global -n default --type merge -p "{\"data\": {\"mosip-injiverify-host\": \"$MOSIP_INJIVERIFY_HOST\"}}"
    # Add the host
    kubectl set env deployment/config-server SPRING_CLOUD_CONFIG_SERVER_OVERRIDES_MOSIP_ESIGNET_INJIVERIFY_HOST=$MOSIP_INJIVERIFY_HOST -n config-server
    # Restart the configserver deployment
    kubectl -n config-server get deploy -o name | xargs -n1 -t kubectl -n config-server rollout status 

echo Create $NS namespace
kubectl create ns $NS

function installing_inji-verify-ui() {
  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite

  helm repo add mosip https://mosip.github.io/mosip-helm
  helm repo update

  echo Copy configmaps
  COPY_UTIL=../copy_cm_func.sh
  $COPY_UTIL configmap global default $NS
  $COPY_UTIL configmap artifactory-share artifactory $NS
  $COPY_UTIL configmap config-server-share config-server $NS

  INJIVERIFY_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-injiverify-host})
  echo Installing INJIVERIFY
  helm -n $NS install inji-verify-ui mosip/inji-verify-ui \
  --set istio.hosts\[0\]=$INJIVERIFY_HOST \
  --set inji_verify_service.host="inji-verify-service.$NS" \
  --version $CHART_VERSION 

  kubectl -n $NS  get deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed inji-verify-ui
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_inji-verify-ui   # calling function
