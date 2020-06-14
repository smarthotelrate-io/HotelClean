#!/bin/sh

set -e

# Fix broken alpine linux resolv.conf behavior (DNS issue when deployed w/ Kubernetes)
# https://github.com/gliderlabs/docker-alpine/issues/8
if grep -q '^options.*ndots' /etc/resolv.conf ; then
  grep -v ndots /etc/resolv.conf > /tmp/resolv.conf && \
  cat /tmp/resolv.conf > /etc/resolv.conf && \
  echo "removed options ndots from /etc/resolv.conf"
fi

exec "$@"
