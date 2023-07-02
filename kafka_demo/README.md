# Instructions

`npm i` in service2, service2 folders
`docker compose up` or `docker compose up --force-recreate` in service1 folder to have the broker up and running
`docker compose stop` to stop it

service2 is the producer. Run `docker build` to create an image with whatever name.
service3 is the consumer. Do the same.

producer, consumer, broker should be in the same network. Currently the broker
just has the default network

In the `docker-compose.yaml` file you can see the name of the default network (and change it)

When running producer/consumer do `docker run --network <default network name> <given name>`
