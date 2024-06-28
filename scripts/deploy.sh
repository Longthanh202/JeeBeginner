#!/bin/bash

# Publish
docker stack deploy -c swarm.yml --with-registry-auth $PROJECT_NAME