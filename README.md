![](tr-app/img/techradar_logo_100.png)

The interactive <strong>Technology Radar</strong> (also called <strong>TechRadar</strong>) describes future technology developments or trends that will impact how makers will create, communicate, organize and might even do business.

Its purpose is to provide state-of-the-art overviews of both: 1) Information and Communication Technology (ICT) and related applications developed and/or used by The results of this research will help to understand the uses and impacts of <strong>CAPS</strong> in different contexts, as well as of the Maker movement itself., and 2) maker technology developed and/or used by makers. This will include the relationships and mutual complementary of the two. In this way, it developes forward scenarios and a watching brief of these two technology areas and how they are used by The results of this research will help to understand the uses and impacts of <strong>CAPS</strong> in different contexts, as well as of the Maker movement itself. and maker communities both respectively and in combination.

Read more [here](http://make-it.io/deliverables/d5-1-report-on-mapping-of-ict-and-maker-technology-and-its-use/) and [here](http://make-it.io/deliverables/d5-2-report-on-forward-scenarios-of-technology-developments-and-technology-use/).

## Installation

Install packages in server and app:

```
cd tr-server
npm install
cd..

cd tr-app
npm install
yarn install
```

Run app:

```
cd tr-app
npm start
```

## Docker

If you want to build and run the TechRadar using docker, you can use the following commands for building and running

build:
```
docker build -t tr . --no-cache
```

run:
```
docker run -p 8080:8080 tr
```

## Credits

[![](tr-app/img/from_30.png)](https://ec.europa.eu/digital-agenda/en/news/22-new-caps-projects-horizon-2020)
