#! /bin/sh

# This script applies all of the CATS tools environment OpenShift
# manifests, **EXCEPT** for the secrets so that any existing secrets are not
# overwritten.

set -eu

scriptdir="$(dirname "$0")"

if ! command -v oc >/dev/null 2>&1; then
    echo "oc command not found. Please install the OpenShift CLI (oc) and ensure it is in your PATH."
    exit 1
fi

if ! oc status >/dev/null 2>&1; then
    echo "Not logged in to OpenShift. Please log in using 'oc login' and try again."
    exit 1
fi

find "${scriptdir}/../cats/tools/" -type f -name '*.yaml' ! -name '*secret*' -exec oc apply -f {} \;
