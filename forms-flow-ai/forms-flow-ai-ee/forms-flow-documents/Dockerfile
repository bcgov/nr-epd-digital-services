#Author: Kurian Benoy
FROM python:3.13.9-slim-bookworm

# set label for image
LABEL Name="formsflow"

WORKDIR /forms-flow-documents/app

# install curl, gnupg2 and unzip
RUN  apt-get update \
    && apt-get install -y gnupg2 \
    && apt-get install -y curl \
    && apt-get install -y wget \
    && apt-get install -y unzip \
    && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*

# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_URL
# expect ssh private key
ARG ssh_prv_key
# expect ssh public key
ARG ssh_pub_key
# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_BRANCH
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_BRANCH epd-ff-ee-5.2.0
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_URL git@github.com:AOT-Technologies/forms-flow-ai-ee.git

RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config

RUN echo "$ssh_prv_key" |  sed 's/\\n/\n/g'  > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" |  sed 's/\\n/\n/g' > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub

#COPY id_rsa_epd /root/.ssh/id_rsa
#COPY id_rsa_epd.pub /root/.ssh/id_rsa.pub

#RUN chmod 600 /root/.ssh/id_rsa

#RUN chmod 600 /root/.ssh/id_rsa.pub

RUN mkdir -p /root/.ssh && ssh-keyscan github.com >> /root/.ssh/known_hosts

# Clone code
RUN git clone ${FORMFLOW_SOURCE_REPO_URL} -b ${FORMFLOW_SOURCE_REPO_BRANCH} /documents/

RUN cp -r /documents/forms-flow-documents/. /forms-flow-documents/app

#Copy custom files for EPD
COPY ./src/formsflow_documents/resources /forms-flow-documents/app/src/formsflow_documents/resources
COPY ./src/formsflow_documents/services /forms-flow-documents/app/src/formsflow_documents/services
COPY ./src/formsflow_documents/static /forms-flow-documents/app/src/formsflow_documents/static
COPY ./src/formsflow_documents /forms-flow-documents/app/src/formsflow_documents

# Install Chrome WebDriver - version 116.0.5845.96
RUN mkdir -p /opt/chromedriver && \
    curl -sS -o /tmp/chromedriver_linux64.zip https://formsflow-documentsapi.aot-technologies.com/chromedriver-linux64.zip && \
    unzip -qq /tmp/chromedriver_linux64.zip -d /opt/chromedriver && \
    rm /tmp/chromedriver_linux64.zip && \
    chmod +x /opt/chromedriver/chromedriver-linux64/chromedriver && \
    ln -fs /opt/chromedriver/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver

# Install Google Chrome
RUN wget --no-verbose -O /tmp/chrome.deb https://formsflow-documentsapi.aot-technologies.com/google-chrome-stable_116.0.5845.140-1_amd64.deb &&\
    apt-get update  && \
    apt-get -f install -y /tmp/chrome.deb &&\
    rm /tmp/chrome.deb


# set display port to avoid crash
ENV DISPLAY=:99

COPY requirements.txt .
ENV PATH=/venv/bin:$PATH

RUN : \
    && python3 -m venv /venv \
    && pip install --upgrade pip \
    && pip install -r requirements.txt 

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
