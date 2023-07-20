# NTUA ECE SaaS 2023 Project (Team 8)

A SaaS app that runs in Docker Containers with an architecture based on microservices, that allows users to create and store charts. The architecture of the information system is shown below in the form of a UML Component Diagram, which can be accessed in architecture/myCharts_team08.vpp along with UML Deployment and Sequence Diagrams that document this system. Microservices are divided per task and diagram type where applicable, for 9 total diagram types.

![image](https://github.com/vanourogeros/NTUA-SaaS-08/assets/61976410/90bcfbfa-c898-4852-a392-6ce42dd712bd)


## How To Run:

* Clone repo to an empty folder. `cd` to that folder.
* `cd docker_compose`
* `docker build -t puppeteer .`
* Recommended way to run (frontend running locally):
  * `docker compose up`
  * `cd ../frontend`
    * If you are on an (M1/M2) Mac:
    * `brew install cairo`
    * `brew install pango`
  * `npm install`
  * `npm run dev`
  * Frontend is now listening on `http://localhost:3000`
  * `docker compose down` when you are done (or stop it AND delete it from the desktop app)
* Not recommended way to run (frontend running dockerized):
  * `docker compose --profile frontend up`
  * Frontend is now listening on `http://localhost:3000`
  * `docker compose --profile frontend down` when you are done (or stop it AND delete it from the desktop app)

If the frontend is ran dockerized, it will be very slow and maybe even unresponsive due to the large number of containers running at the same time (at least it was on our computers). If your computer's architecture is `arm64`, be warned that due to some missing packages on `arm64` the frontend container is ran in a `linux/amd64` image (which will be extremely slow on your machine).

That's it.

Tools used: `Node.js`, `Next.js`, `Docker`, `Apache Kafka`, `MongoDB (Atlas)`, `Highcharts`.

Special thanks to the creator(s) of the `wurstmeister/zookeeper` and `wurstmeister/kafka` docker images.

## Team Members:
I want to thank my team members Dimitrios Georgousis and Georgios-Alexios Kapetanakis for their collaboration and the immense work they put into this project which greatly helped in its completion and the understanding of the underlying technologies. Our commits can be identified, mainly in the `main` and `dev-restructure` branches, by our `ntua-el19XXX` handles.

* Dimitrios Georgousis, [ntua-el19005](https://github.com/ntua-el19005)
* Georgios-Alexios Kapetanakis, [ntua-el19062](https://github.com/ntua-el19062)
* Ioannis Protogeros, [ntua-el19008](https://github.com/ntua-el19008), [vanourogeros](https://github.com/vanourogeros)
