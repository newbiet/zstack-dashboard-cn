i#!/bin/bash

zstack-cli LogInByAccount accountName=admin password=password
#target VM number

times=2

#need to set correct uuid in following 3 lines. You can get uuid from UI.
instanceOfferingUuid=7c908ad43b394c94ae8ddd956af4ba26
imageUuid=39834cc7d8e842c3b4fc9d3313e585cc
l3NetworkUuids=5d714dde82d74519b21162c38ad31993

while [ $times -gt 0 ]; do
    zstack-cli CreateVmInstance name=Desktop-${times} instanceOfferingUuid=$instanceOfferingUuid imageUuid=$imageUuid l3NetworkUuids=$l3NetworkUuids&
    times=`expr $times - 1`
done

