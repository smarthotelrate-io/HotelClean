FROM alpine:3.11
RUN apk add --update curl && apk add --update npm && \
    rm -rf /var/cache/apk/*


COPY . /opt/ansero/

WORKDIR /opt/ansero/

RUN npm install --only=production

ENTRYPOINT ["/opt/ansero/docker-entrypoint.sh"]

EXPOSE 3025

CMD ["npm", "run", "start"]
