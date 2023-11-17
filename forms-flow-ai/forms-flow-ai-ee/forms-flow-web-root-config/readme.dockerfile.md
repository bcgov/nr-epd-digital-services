<!-- First build with proper SSH keys. They are required to pull from AOT's private EE repo. -->

docker build -t ff-ee-root-config \
  --build-arg ssh_prv_key="$(cat /Users/ericribeiro/.ssh/id_rsa_epd)" \
  --build-arg ssh_pub_key="$(cat /Users/ericribeiro/.ssh/id_rsa_epd.pub)" \
  --build-arg MF_FORMSFLOW_WEB_URL=https://forms-flow-web-ee-latest.apps.silver.devops.gov.bc.ca/forms-flow-web.js \
  --build-arg MF_FORMSFLOW_SERVICE_URL=https://forms-flow-microfrontends.aot-technologies.com/forms-flow-service@v5.2.1-alpha/forms-flow-service.gz.js \
  --build-arg MF_FORMSFLOW_ADMIN_URL=https://forms-flow-microfrontends.aot-technologies.com/forms-flow-admin@v5.2.1-alpha/forms-flow-admin.gz.js \
  --build-arg MF_FORMSFLOW_NAV_URL=https://forms-flow-nav-dev.apps.silver.devops.gov.bc.ca/forms-flow-nav.js \
  --build-arg MF_FORMSFLOW_THEME_URL=https://forms-flow-theme-dev.apps.silver.devops.gov.bc.ca/forms-flow-theme.js \
  --build-arg REACT_APP_CUSTOM_LOGOUT_URL="https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=https://epd-keycloak-dev.apps.silver.devops.gov.bc.ca/auth/realms/forms-flow-ai/protocol/openid-connect/logout?post_logout_redirect_uri=https://epd-frontend-dev.apps.silver.devops.gov.bc.ca/" \
  --build-arg REACT_APP_CUSTOM_MAP_URL=https://epd-frontend-dev.apps.silver.devops.gov.bc.ca/map \
  --build-arg NODE_ENV=production \
  .

<!-- Start the container -->
docker run --rm \
  --name ff-ee-root-config \
  --env-file /Users/ericribeiro/Projects/nr-epd-digital-services/forms-flow-ai/forms-flow-ai-ee/forms-flow-web-root-config/.env \
  -p 8081:8080 \
  ff-ee-root-config

<!-- Now ensure the localhost:8081/config/config.js looks like this: https://forms-flow-web-root-config-dev.apps.silver.devops.gov.bc.ca/config/config.js -->
<!-- It will probably be empty or not exist. Create it and ensure they look the same (e.g., using echo) -->