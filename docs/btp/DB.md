# Databases

## Postgres

We can use the PostgreSQL Service provided through `@cap-js/postgres`, the package uses `cds-plugin` technique to auto-configure your application and use a PostgreSQL database for production.

For local development and testing convenience, you can run PostgreSQL in a docker container.

- Setup local database `docker-compose -f pg.yml up -d` or `docker-compose -f pg.yml --env-file=/dev/null up -d`


Check your db config for production using command

`cds env requires.db --for production`

