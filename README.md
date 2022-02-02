# Server Infrastrukture
The following illustration shows an overview about ARQMS and all parts
![Overview](docs/server_overview.png "Server Overview")

# First Step
Ensure docker and docker compose is installed on your developing machine. 
Before you start the docker containers, a `.env` file must be created on the repository root directory. Ensure you use a secury master key (>128bit)
```ini
INITDB_ROOT_USERNAME=root
INITDB_ROOT_PASSWORD=root
DATABASE_URI=mongodb://root:root@storage:27017/dev
APP_ID=arqms
MASTER_KEY=masterKey
SERVER_URI=http://localhost:1337/parse
APP_URI=http://localhost:49430/
SMTP_PORT=587
SMTP_HOST=
SMTP_EMAIL=
SMTP_PWD=
```

When you start parse_dashboard service for development purpose, ensure `parse_dashboard/config.json` exists and is configured
according to the `.env` file!
```json
{
 "apps": [
   {
     "serverURL": "http://localhost:1337/parse",
     "appId": "arqms",
     "masterKey": "masterKey",
     "appName": "ARQMS - Local"
   }
 ]
}
```

According to your needs, either first of second command shall be run on your docker engine machine.
```
for production>  docker compose -f docker-compose.yml -p "ARQMS" up up

        - or -

for development> docker compose -f docker-compose.yml -f docker-compose.dev.yml -p "ARQMS" up --build
```

**Note:** The following step is only required for the very first time when containers are created.
Open any mongo cli and connect with the `db.auth("root", passwordPrompt())` (use the INITDB_ROOT_USERNAME). Then run the following command to create a new user according to the `.env` file `DATABASE_URI`. Restart the parse_server container.
```
use dev
db.createUser(
    {
        user: "root",
        pwd: "root",
        roles: [
            { role: "dbOwner", db: "dev" }
        ]
    }
)
```



# Installation
The following steps are only required for productive system. See [First Step](#first-step) otherwise

[Raspberry PI](./docs/installation-rpi.md)
Azure Cloud (TBD)
