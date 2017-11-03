## Platform Name

Long  : Blockchain Independent Trusted and Public Event Ledger

Short : BitApel

## Runtime

Hyperledger Fabrik & Composer usefull links : 

https://github.com/oscarkoe/hyperledger-on-azure

https://hyperledger.github.io/composer/installing/development-tools.html

https://composer-playground.mybluemix.net

https://hyperledger.org/projects/fabric

https://hub.docker.com/r/cesarev/fabric-boilerplate/

https://github.com/Altoros/fabric-rest/

Backend + public frontend + admin front end is a Node.js app with Express REST Service and 2 static folders

Datastore : MongoDB (environment var MONDODB_URL or CF service binded to the deployed instance, VCAP_SERVICES)

## Web Platform Technical Description

### Blockchain - Hyperledger Fabric Network made and deployed with Hyperledger Composer

#### Participants

* System (1 record with id = SYSTEM)
* User - each user that has an account

#### Assets (CREATION, EVENT, INFO, MAINTENANCE, REPAIR, DAMAGE, SALE)

* Thing - assets defined by users binded to each owner

#### Transactions

* InfoEvent
* BuyEvent
* SellEvent
* DamageEvent
* RepairEvent
* MaintenanceEvent

### MongoDB Database Collections

- User
	id
	email
	password
	firstName
	lastName
	createdAt

- UserNotifications
	id
	dateCreated
	dateReceiveConfirmed
	type
	text
	confirmed (int 0, 1)

### Backend Technology Stack

* Node.js
* Express
* BCrypt for passwords
* AES_256_CTR encryption for database and BlockChain transactions stored

### UI & UX

#### Public Frontend UI

Made with SOLID Bootstrap Theme : http://blacktie.co/demo/solid/

#### Amin Frontend UI

Made with SAP Open UI5 : http://openui5.org/

Develop Start Guide : https://github.com/SAP/openui5/blob/master/docs/developing.md
