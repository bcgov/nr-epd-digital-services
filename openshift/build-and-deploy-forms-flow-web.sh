#!/bin/sh

oc project e38158-tools

oc start-build forms-flow-web-build --wait

oc tag forms-flow-web:latest forms-flow-web:dev


# NEW APPROACH IDEA, USE OCP ANNOTATIONS
# ADD THIS TO DEPLOYMENT ANNOTATIONS
# https://stackoverflow.com/questions/74348672/how-do-i-use-an-imagestream-from-another-namespace-in-openshift
# https://docs.openshift.com/container-platform/4.10/openshift_images/triggering-updates-on-imagestream-changes.html
image.openshift.io/triggers: '[{"from":{"kind":"ImageStreamTag","name":"forms-flow-web:dev","namespace":"e38158-tools"},"fieldPath":"spec.template.spec.containers[?(@.name==\"forms-flow-web\")].image"}]'


# Get actual image hash
# First, verify we're getting the `dev` tags.
# TAG_NAME=$(oc get is/forms-flow-web -o=jsonpath='{.status.tags[0].tag}')

# if [[ "$TAG_NAME" != "dev" ]]; then
#   echo "TAG_NAME expected to equal 'dev', actually equals $TAG_NAME"
#   exit 1
# fi

# # Now that we know we're in dev environment, it's safe to check the image path this way.
# IMAGE_PATH=$(oc get is/forms-flow-web -o=jsonpath='{.status.tags[0].items[0].dockerImageReference}')


# #  oc get is/forms-flow-web -o=jsonpath='{.status}'
# oc project e38158-dev

# oc set image deployment/forms-flow-web 
# # Change to dev environment
# # Update `image` param with oc edit? oc apply? 


# ALTERNATIVE IDEA

image.openshift.io/triggers: '[{"from":{"kind":"ImageStreamTag","name":"forms-flow-web:dev","namespace":"e38158-tools"},"fieldPath":"spec.template.spec.containers[?(@.name==\"forms-flow-web\")].image"}]'