#!/bin/bash
read -p "Please enter a namespace (ex: forms-flow):" NAMESPACE

echo "Uninstalling forms flow ..."

helm uninstall forms-flow-admin -n $NAMESPACE

helm uninstall forms-flow-ai -n $NAMESPACE

helm uninstall forms-flow-api -n $NAMESPACE

helm uninstall forms-flow-analytics -n $NAMESPACE

helm uninstall forms-flow-bpm -n $NAMESPACE

helm uninstall forms-flow-data-analysis -n $NAMESPACE

helm uninstall forms-flow-forms -n $NAMESPACE

helm uninstall forms-flow-idm -n $NAMESPACE

helm uninstall forms-flow-web -n $NAMESPACE

helm uninstall forms-flow-documents-api -n $NAMESPACE

echo "Uninstall complete!"
