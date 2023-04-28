#!/bin/sh

oc project e38158-tools
oc start-build forms-flow-web-build --wait
oc tag forms-flow-web:latest forms-flow-web:dev

# Note, the above relies on the folloiwng yaml being setup below
# This yaml adds a ImageStreamTag trigger on a Deployment via metadata annotations.

# NEW APPROACH IDEA, USE OCP ANNOTATIONS
# ADD THIS TO DEPLOYMENT ANNOTATIONS
# https://stackoverflow.com/questions/74348672/how-do-i-use-an-imagestream-from-another-namespace-in-openshift
# https://docs.openshift.com/container-platform/4.10/openshift_images/triggering-updates-on-imagestream-changes.html
# image.openshift.io/triggers: '[{"from":{"kind":"ImageStreamTag","name":"forms-flow-web:dev","namespace":"e38158-tools"},"fieldPath":"spec.template.spec.containers[?(@.name==\"forms-flow-web\")].image"}]'
