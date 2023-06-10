# Instructions

`npm i` in service2, service2 folders
`docker compose up` in service1 folder to have the broker up and running
`docker compose stop` to stop it

service2 is the producer. Run `docker build` to create an image with whatever name
service3 is the consumer. Do the same.

producer, consumer, broker should be in the same network. Currently the broker
just has the default network (you can find it's name by doing `docker network ls`,
but it usually is `service1_default`)

When running producer/consumer do `docker run --network service1_default <given name>`
