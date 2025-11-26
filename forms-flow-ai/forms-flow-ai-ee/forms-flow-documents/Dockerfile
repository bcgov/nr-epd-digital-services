#Author: Kurian Benoy
FROM --platform=linux/amd64 python:3.14-bookworm

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

# Install Google Chrome from local deb package
COPY google-chrome-stable_116.0.5845.140-1_amd64.deb /tmp/chrome.deb
RUN apt-get update && \
    apt install -y /tmp/chrome.deb && \
    rm /tmp/chrome.deb

# set display port to avoid crash
ENV DISPLAY=:99

COPY requirements.txt .
ENV PATH=/venv/bin:$PATH

RUN : \
    && python3 -m venv /venv \
    && pip install --upgrade pip setuptools \
    && pip install -r requirements.txt 

ADD . /forms-flow-documents/app
RUN pip install -e .

EXPOSE 5006
RUN chmod u+x ./entrypoint
ENTRYPOINT ["/bin/sh", "entrypoint"]
