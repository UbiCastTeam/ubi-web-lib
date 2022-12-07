DOCKER_IMAGE_NAME ?= ubi-web-lib

build_docker_img:
	docker build --tag ${DOCKER_IMAGE_NAME} .

install:
	npm install

lint:
ifndef IN_DOCKER
	docker run -it --rm -v ${CURDIR}:/apps ${DOCKER_IMAGE_NAME} make lint
else
	make install
	npm run lint
endif

build:
ifndef IN_DOCKER
	docker run -it --rm -v ${CURDIR}:/apps ${DOCKER_IMAGE_NAME} make build
else
	make install
	npm run build
endif
