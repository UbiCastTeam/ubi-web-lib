install:
	npm install

build: install translate
	npm run build

lint: install
	npm run lint
