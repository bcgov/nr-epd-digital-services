# Readme

This file is responsible for uploading files from `backup-container` to Object Storage.

# Setup

```bash
# Create virtual environment for local dev
python -m venv backup-copy

# Local dev setup 
# Load up virtual environment, use this when re-activating terminal
source backup-copy/bin/activate

## First time setup, install dependencies
pip install -r requirements.txt
```

## Running Dockerfile

Note: We have a local dockerfile that uses dockerhub, and an OpenShift-ready Dockerfile that uses cached images available in BCGov Artifactory.  For local builds, use dockerhub.

```bash

docker build -t copy-to-s3 -f dockerfile.local .

```


## Pre-requisite for OpenShift: Backup-container pvc

This script assumes the BCGov backup-container is already running. https://github.com/BCDevOps/backup-container

This requires one change to the PVC, which can be done manually via the OpenShift web GUI, and should only take 1 min.

The backup-container pvc, normally called "epd-bkup-pvc" is by default a Read-Write-One PVC.  This won't work for us, we need ReadWriteMany.

So:

1. Create a new PVC called "epd-bkup-shared-pvc". Set type to "netapp-file-backup" (Storage > Peristent Volume Claims > Create)
2. Change backup-container to use new PVC.  Open up DeploymentConfig/backup-container yaml (eg epd-bkup), and modify instances of "epd-bkup-pvc" to "epd-bkup-shared-pvc"
3. Verification: Log onto new pod, and do `ls /backups/`.  It should be an empty folder as it's a new pvc.
4. Run `./backup.sh -1` to manually trigger a backup, then do `ls /backups/` to verify it's there.


This copy-to-s3 script is configured to use `epd-bkup-shared-pvc`, but if you use something different just change `deploy-job.yaml`

## Deploy to OpenShift

```bash
# in tools
oc project ****-tools
oc process -f build-job.yaml -o yaml | oc apply -f -
oc start-build backup-to-s3-build

# in dev
oc project ****-test # or prod


# upload env file as params - manually verify output the yaml looks correct and is loading envs!
oc process -f deploy-job.yaml --param-file=.env -o yaml
# then upload job yaml
oc process -f deploy-job.yaml --param-file=.env -o yaml | oc apply -f -


# Optional: Dry-run, use this command instead of above if you want to do a dry-run. Advised 
oc process -f deploy-job.yaml --param-file=.env -o yaml | oc apply -f - --dry-run=server
```


## Trigger the cronjob manually

Want to just trigger the cronjob manually? This can be useful while developing (i.e. you don't want to wait until schedule to verify it works), or if you want to just trigger a backup.

```bash
oc create job --from=cronjob/<cronjob-name> <job-name> -n <namespace-name>
oc create job --from=cronjob/backup-to-s3 s3-job-manual-1
# Note: You will need to manually increment the job number when creating a job.
```
