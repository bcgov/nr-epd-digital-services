FROM --platform=linux/amd64 python:3.13.9-bookworm

LABEL Name="formsflow"

WORKDIR /forms-flow-documents/app

RUN  apt-get update \
    && apt-get install -y gnupg2 \
    && apt-get install -y curl \
    && apt-get install -y wget \
    && apt-get install -y unzip \
    && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /opt/chromedriver && \
    curl -sS -o /tmp/chromedriver_linux64.zip https://formsflow-documentsapi.aot-technologies.com/chromedriver-linux64.zip && \
    unzip -qq /tmp/chromedriver_linux64.zip -d /opt/chromedriver && \
    rm /tmp/chromedriver_linux64.zip && \
    chmod +x /opt/chromedriver/chromedriver-linux64/chromedriver && \
    ln -fs /opt/chromedriver/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver

RUN wget --no-verbose -O /tmp/chrome.deb https://formsflow-documentsapi.aot-technologies.com/google-chrome-stable_116.0.5845.140-1_amd64.deb &&\
    apt-get update  && \
    apt install -y /tmp/chrome.deb &&\
    rm /tmp/chrome.deb

# Install Node.js, rsync and nodemon for the watcher
RUN apt-get update && apt-get install -y nodejs npm rsync \
    && npm install -g nodemon

COPY requirements.txt .
ENV PATH=/venv/bin:$PATH

RUN : \
    && python3 -m venv /venv \
    && pip install --upgrade pip \
    && pip install -r requirements.txt

ARG FORMFLOW_SOURCE_REPO_URL
ARG ssh_prv_key
ARG ssh_pub_key
ARG FORMFLOW_SOURCE_REPO_BRANCH
ENV FORMFLOW_SOURCE_REPO_BRANCH epd-ff-ee-5.2.0
ENV FORMFLOW_SOURCE_REPO_URL git@github.com:AOT-Technologies/forms-flow-ai-ee.git

RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config

RUN echo "$ssh_prv_key" |  sed 's/\\n/\n/g'  > /root/.ssh/id_rsa && \
   echo "$ssh_pub_key" |  sed 's/\\n/\n/g' > /root/.ssh/id_rsa.pub && \
   chmod 600 /root/.ssh/id_rsa && \
  chmod 600 /root/.ssh/id_rsa.pub

RUN mkdir -p /root/.ssh && ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN git clone ${FORMFLOW_SOURCE_REPO_URL} -b ${FORMFLOW_SOURCE_REPO_BRANCH} /documents/

RUN cp -r /documents/forms-flow-documents/. /forms-flow-documents/app

# Copy custom files for EPD
COPY ./src/formsflow_documents/resources /forms-flow-documents/app/src/formsflow_documents/resources
COPY ./src/formsflow_documents/services /forms-flow-documents/app/src/formsflow_documents/services
COPY ./src/formsflow_documents/static /forms-flow-documents/app/src/formsflow_documents/static
COPY ./src/formsflow_documents /forms-flow-documents/app/src/formsflow_documents



ENV DISPLAY=:99

COPY local_entrypoint.sh /local_entrypoint.sh
RUN chmod +x /local_entrypoint.sh

ADD . /forms-flow-documents/app
RUN pip install -e . && \
    pip uninstall ecdsa -y && \
    apt-get remove -y \
    git unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 5006
RUN chmod u+x ./entrypoint
ENTRYPOINT ["/bin/sh", "entrypoint"]
