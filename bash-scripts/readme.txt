START STOP THE COMPOSER :

./composer.sh stop 
./composer.sh start
./composer.sh restart


INSTALL COMPOSER CLI : 

sudo npm install -g composer-cli


DEPLOY NETWORK : 

composer network deploy -p hlfv1 -a my-log-network.bna -i PeerAdmin -s randomString -A admin -S
composer network ping -n my-log-network -p hlfv1 -i admin -s andminpw
composer network list -n my-log-network -p hlfv1 -i admin -s andminpw


DEPLOY REST SERVER :

sudo npm install -g composer-rest-server
composer-rest-server -p hlfv1 -n my-log-network -N never -i admin -s adminpw

or 

composer-rest-server

parameters :
 
profile : hlfv1
user : admin
pass : adminpw

http://localhost:3000/explorer/

Transaction example body :

{
  "$class": "org.test.model.Log",
  "text": "text for transaction",
  "user": "resource:org.test.model.User#id:user1",
  "system": "resource:org.test.model.System#id:system",
  "timestamp": "2017-10-30T13:09:14.587Z"
}

