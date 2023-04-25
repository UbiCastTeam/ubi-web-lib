DOCKER_IMAGE_NAME ?= ubi-web-lib
DOCKER_RUN ?= docker run \
	--name ubi-web-lib-container \
	--workdir /apps \
	--mount type=bind,src=${PWD},dst=/apps \
	--user "$(shell id -u):$(shell id -g)" \
	--rm -it

docker_build:
	docker build --tag ${DOCKER_IMAGE_NAME} .

docker_rebuild:
	docker build --no-cache -t ${DOCKER_IMAGE_NAME} .

lint:
	${DOCKER_RUN} ${DOCKER_IMAGE_NAME} make lint_local

lint_local:
	npm run lint

build:
	${DOCKER_RUN} ${DOCKER_IMAGE_NAME} make build_local

build_local:
	npm run build
