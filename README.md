# social-media-video-app
micro-services nestjs social-media video app 

This app is not meant to work (YET!!!) but its just a demonstration on how to build microservices nestjs app and deploy it to a kubernetes cluster.

This app is still in development process, feel free to collaborate by creating a new branch and opening a pull request.

# tech stack
_apache kafka

_postgres

_typeorm

_nestjs

_kubernetes

_docker

_graphql

_jwt

# microservices
<i>auth service</i>: handling authentication with jwt.

<i>content service</i>: handling all jobs related to social media activities like uploading videos, fetching videos, simple videos recommendation, ect..

# gateway
<i>main</i>: handling client requests using graphql as a query language, and communicate with other microservices using apache kafka. 

# techniques
<i> CQRS </i>: using event sourcing with sagas and commands handlers.
