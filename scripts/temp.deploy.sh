#!/bin/bash

# Publish
docker stack deploy -c temp.swarm.yml --with-registry-auth $PROJECT_NAME