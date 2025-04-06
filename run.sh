#!/bin/bash
docker build -t 'test:8080/test/test' . && \
  docker run --rm --name stock -v $pwd/pics:/pics -p 3030:3000  test:8080/test/test
