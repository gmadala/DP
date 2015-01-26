FROM ubuntu:14.04

MAINTAINER NextGear Capital "http://nextgearcapital.com"

# Install node
RUN apt-get update -y && apt-get install --no-install-recommends -y -q curl python build-essential git ca-certificates software-properties-common
RUN mkdir /nodejs && curl http://nodejs.org/dist/v0.10.35/node-v0.10.35-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1

ENV PATH $PATH:/nodejs/bin

# install nginx
RUN \
  add-apt-repository -y ppa:nginx/stable && \
  apt-get update && \
  apt-get install -y nginx && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf

# Create path
RUN mkdir /opt/dealer-portal
ADD target/dealer-portal.tar.gz /opt/dealer-portal/
WORKDIR /opt/dealer-portal

# Copy nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

CMD ["nginx"]
