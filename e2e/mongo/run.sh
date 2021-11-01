
#!/bin/bash
init(){
    sleep 5
    echo "Running initialise"
    echo "rs.initiate( { _id : \"rs0\", members: [{ _id: 0, host: \"mongodb:27017\" }]})" | mongosh --quiet
}
init &
/usr/bin/mongod --bind_ip_all --replSet rs0
