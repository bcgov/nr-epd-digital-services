# Readme SSH Deploy Key

1. Create deploy key
2. Upload to github repo

```bash

## Create deploy Key
ssh-keygen -t ed25519 -C "adam.coard@aot-technologies.com" -f /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd
```

## Docker build command - note, update paths to deploy key as appropriate

```bash
docker build -t ff-ee-web --build-arg ssh_prv_key="$(cat /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd)" --build-arg ssh_pub_key="$(cat /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd.pub)" .

## Docker build with resources
## Use this if you start running into out of memory issues
docker build --build-arg NODE_OPTIONS=--max-old-space-size=6144 --memory=7144m --memory-swap=-1   --cpu-period=100000 --cpu-quota=50000 -t ff-ee-web --build-arg ssh_prv_key="$(cat /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd)" --build-arg ssh_pub_key="$(cat /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd.pub)" .

# # DEBUG ONLY REMOVE
# docker build -t ff-ee-web --build-arg ssh_prv_key="$(cat /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd_newlines)" --build-arg ssh_pub_key="$(cat /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd.pub)" .

## Run command
docker run --name ff-ee-web -p 3004:8080 --rm ff-ee-web


# Debug container
docker run --name ff-ee-web --rm -p 8080:8080 ff-ee-web cat /etc/nginx/nginx.conf
```

## Upload SSH Key to OpenShift

IN TOOLS ENVIRONMENT

```bash

oc create secret generic ff-ee-deploy-key \
       --from-file=ssh-privatekey=/Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd \
       --type=kubernetes.io/ssh-auth

oc create secret generic ff-ee-deploy-key-pub \
       --from-file=ssh-privatekey=/Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd.pub \
       --type=kubernetes.io/ssh-auth

```

Patch yaml:

```yaml

       dockerStrategy:
         env:
           - name: ssh_prv_key
             valueFrom:
               secretKeyRef:
                 name: ff-ee-deploy-key
                 key: ssh-privatekey
            - name: ssh_pub_key
             valueFrom:
               secretKeyRef:
                 name: ff-ee-deploy-key-pub
                 key: ssh-privatekey

```

## Strip newlines from ssh key

sed 's/\\n/\n/g' /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd_newlines > test
sed 's/\\n/\n/g' test > test2
