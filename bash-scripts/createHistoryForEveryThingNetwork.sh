#!/bin/bash

sudo killall node

/home/fabric/composer.sh stop
/home/fabric/composer.sh start

rm -f /home/fabric/bitapel.bna

cp /home/fabric/bitapel/fabric-composer/bitapel.bna /home/fabric/bitapel.bna

sudo /usr/local/bin/composer network deploy -p hlfv1 -a /home/fabric/bitapel.bna -i PeerAdmin -s randomString -A admin -S

sleep 5

#sudo /usr/local/bin/composer network ping -n bitapel -p hlfv1 -i admin -s andminpw

#sudo /usr/local/bin/composer network list -n bitapel -p hlfv1 -i admin -s andminpw

sleep 5

sudo /usr/local/bin/composer-rest-server -p hlfv1 -n bitapel -N never -i admin -s adminpw
