#!/bin/bash

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class": "org.bitapel.model.System","id": "system"}' 'http://localhost:3000/api/System' > /dev/null

sleep 1

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class": "org.bitapel.model.User","id": "test"}' 'http://localhost:3000/api/User' > /dev/null

sleep 1

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class": "org.bitapel.model.Thing","id": "test","name": "test name","owner":"resource:org.bitapel.model.User#id:test","serial": "testserial","category": "test category","manufacturer": "test manufacturer","type": "test type","buyDate": "2017-10-31T14:40:46.015Z"}' 'http://localhost:3000/api/Thing' > /dev/null

sleep 1

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class": "org.bitapel.model.InfoEvent","resource": "resource:org.bitapel.model.Thing#id:test","owner": "resource:org.bitapel.model.User#id:test", "recordedBy": "test","totalWorkingUnits": 1,"totalWorkingUnitType": "h","infoDate": "2017-10-31T14:46:44.705Z","infoDetails": "test info"}' 'http://localhost:3000/api/InfoEvent' > /dev/null
