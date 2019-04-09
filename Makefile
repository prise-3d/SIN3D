compose:
	yarn install
	yarn run app:build
	docker-compose up --scale web=3 &
	sleep 5


