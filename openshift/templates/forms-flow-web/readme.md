# Forms Flow Web Custom Changes OpenShift Yaml

This is a dockerfile deploy for our customized forms-flow-web.  The high level summary:

1. Create build in `tools` env.
2. Manually update yaml of deploymentconfig for epd-frontend in devs/tools/environment.

TODO: Update yaml `image` field to avoid having to do step #2 manually.

## Build in Tools

```bash
# make sure in tools
oc process -f forms-flow-web-build.yaml -o yaml | oc apply -f - --dry-run=client
# oc process -f forms-flow-web-build.yaml -o yaml | oc apply -f -
```

# Update DeploymentConfig Yaml

Instead of pulling images from local namespace pushed from GHCR, we pull from tools.

Update `image:` field with has to build from #1.

May also wish to update `ImageChange` trigger

## Manually Triggering a Build

Just tag the build from tools to `dev` or `test`.  Will be creating CI/CD tasks for this and github action in near future.

