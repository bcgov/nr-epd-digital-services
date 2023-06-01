## Applying the Connection

```bash
oc process -f .github/openshift/networkPolicies.yml  -o yaml | oc apply -f -        
```


<!-- oc apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: busybox
spec:
  containers:
    - name: busybox
      image: busybox
      command: [ "/bin/sh", "-c", "while true ; do date; sleep 1; done;" ]
  restartPolicy: Never
EOF -->



## Testing the Connection

Connect to ETL namespace, and create a dummy pod we can ping from to verify connection.

```bash
oc project <etl>-dev
oc apply -f openshift/templates/debug/busybox.yaml


# connect to pod
ping epd-database.e38158-dev.svc.cluster.local
```

postgres-service.env-dev.svc.cluster.local
<!-- "clamav.0198bb-dev.svc.cluster.local" -->