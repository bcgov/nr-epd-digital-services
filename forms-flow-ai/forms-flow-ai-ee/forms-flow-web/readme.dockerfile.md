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
```
