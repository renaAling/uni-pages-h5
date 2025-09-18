FROM nginx

COPY ./dist/build/h5 /data

RUN rm /etc/nginx/conf.d/default.conf

ADD ./default.conf /etc/nginx/conf.d/default.conf

RUN /bin/bash -c 'echo init ok'
