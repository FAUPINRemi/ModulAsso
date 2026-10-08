#!/bin/sh
# RabbitMQ ne lit pas de secret depuis un fichier : on calcule le hachage
# (sha256 salé, format rabbit_password_hashing_sha256) dans un tmpfs au démarrage.
set -eu

sel=$(head -c 4 /dev/urandom | xxd -p)
empreinte=$( { printf '%s' "$sel" | xxd -r -p; tr -d '\n' < /run/secrets/rabbitmq_password; } | sha256sum | cut -d' ' -f1)
hachage=$(printf '%s%s' "$sel" "$empreinte" | xxd -r -p | base64 | tr -d '\n')

sed "s|__HACHAGE__|$hachage|" /etc/rabbitmq/modulasso/definitions.json > /run/rabbitmq/definitions.json

exec docker-entrypoint.sh rabbitmq-server
