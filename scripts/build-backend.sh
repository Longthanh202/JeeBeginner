#!/bin/bash

# Build

if [[ "$DOMAIN" == "jee.vn" ]]
then
    export DOCKERFILE_NAME=Dockerfile_prod
else
    export DOCKERFILE_NAME=Dockerfile_test
fi

docker-compose -f build.yml build backend
docker login $REGISTRY_HOST -u="$REGISTRY_USERNAME" -p="$REGISTRY_PASSWORD"
docker push $REGISTRY_HOST/$REGISTRY_PUBLISHER/$PROJECT_NAME-backend:latest