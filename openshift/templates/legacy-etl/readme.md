# ETL OpenShift Setup

This readme file is about creating the ETL OpenShift environment.

This document includes environment setup, from initial setup to implementing CI/CD.

## OpenShift Environment Setup

The goal of this is a simple deployment strategy involving BuildConfigs in tools, and DeploymentConfigs in dev/test/prod.  Images will be tagged as `imagestreamtag:{dev,test,prod}`.


### Tools Setup

Setup the BuildConfigs, imagestream.

```bash
# Note: Remove --dry-run=client when you want to run it.
oc process -f TODO.yaml | oc apply -f - --dry-run=client

```



### Service Account Setup

This is the easiest step to miss.  This is a one-time setup to grant permissions from service accounts between the tools and dev/test/prod environments. This will allow an image in the tools environment to be deployed to other envs.

```bash

# TODO - UPDATE FOR OUR ENV
# Grant service account permissions
oc policy add-role-to-user system:image-puller \
    system:serviceaccount:*****-dev:todoreplacename \
    --namespace=*****-tools


oc policy add-role-to-user system:image-puller \
    system:serviceaccount:*****-dev:patroni-001 \
    --namespace=*****-tools

oc policy add-role-to-user view system:serviceaccount:NAMESPACE-tools:github-actions-sa


oc policy add-role-to-user system:image-puller system:serviceaccount:e38158-dev:postgresql --namespace=e38158-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:e38158-dev:default --namespace=e38158-tools

oc policy add-role-to-group view system:serviceaccounts:deployer -n e38158-tools
oc policy add-role-to-group view system:serviceaccounts:e38158-test -n e38158-toolsz

```

### Dev Setup

Setup the DeploymentConfig in dev

1. Deploy all built images.
2. For stuff like postgres, just deploy via web ui catalogue? Patroni?

```bash
oc project ****-dev
# Note: Remove --dry-run=client when you want to run it.
oc process -f TODO.yaml | oc apply -f - --dry-run=client

```

### Test and Prod Setup

Run the same "dev" steps, but change all references of "dev" to "test" (and then again with "prod").  Also make sure to change environments, `oc project ****-test`.

## CI/CD Setup

- GitHub Actions (ref FOI)
    - implement branch deploy strategy?
    - workflow_dispatch for prod? can discuss, open to alternative
- Can potentially use existing login secrets for service
    - If so, grant permissions from service account in existing
    - Otherwise, separate service account
    - https://github.com/redhat-actions/oc-login/wiki/Using-a-Service-Account-for-GitHub-Actions
