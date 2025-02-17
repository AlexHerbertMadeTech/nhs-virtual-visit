#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* && $EUID != 0 ]]
then
	commandPrefix="sudo"
else
	commandPrefix=
fi

containerName="nhs-virtual-visit-test"
testDBPassword="P@55w0rd"
testDBUsername="sa"
if [ -f .env ]; then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

# Build images from Dockerfile
docker build -t mssql-test:2017-GA-ubuntu docker/mssql/test

# Run container scripts
docker run --name=${containerName} -p 1433:1433 -d mssql-test:2017-GA-ubuntu

# Microsoft docs advise 45s
wait_time=15s

# Wait for PostgreSQL Server to come up.
echo waiting database to start in $wait_time...
sleep $wait_time
echo database started...

# Create Databases
echo "Database name: ${MSQL_TEST_DB_NAME}"
bin/createDatabaseInDocker.sh ${containerName} $MSQL_TEST_DB_NAME ${testDBUsername} ${testDBPassword}

# Run create tables scripts.
npm run dbmigratetest up:mssql
