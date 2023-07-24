docker build -t ff-ee-root-config --build-arg ssh_prv_key="$(cat /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd)" --build-arg ssh_pub_key="$(cat /Users/adamcoard/Dev/nr-epd-digital-services/notes/id_rsa_epd.pub)" .


docker run --name ff-ee-root-config -p 8081:8080 ff-ee-root-config