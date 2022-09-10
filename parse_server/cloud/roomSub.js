Parse.Cloud.define("updateRoom", async (request) => {
    const deviceQuery = new Parse.Query("Device");
    deviceQuery.equalTo("SerialNumber", request.params.serialnumber);

    const roomQuery = new Parse.Query("Room");
    roomQuery.matchesQuery("Device", deviceQuery);

    var room = await roomQuery.first({ useMasterKey: true });
    if (room == null) {
        return;
    }

    room.set("relativeHumidity", request.params.humidity);
    room.set("pressure", request.params.pressure);
    room.set("temperature", request.params.temperature);
    // TODO create a jub and run bosch  BSEC
    // https://www.bosch-sensortec.com/software-tools/software/bsec/
    // room.set("voc", request.params.VOC);
    // room.set("co2", request.params.CO2);
       
    await room.save(null, {useMasterKey: true});

    // create history item
    const RoomHistory = Parse.Object.extend("RoomHistory");
    var roomHistory = new RoomHistory();
    roomHistory.set("room", room);
    roomHistory.set("relativeHumidity", request.params.humidity);
    roomHistory.set("pressure", request.params.pressure);
    roomHistory.set("temperature", request.params.temperature);
    roomHistory.set("gasResistance", request.params.gasResistance);

    var userId = Object.keys(room.getACL().permissionsById)[0];
    if (userId) {
        const acl = new Parse.ACL();
        acl.setReadAccess(userId, true);
        acl.setWriteAccess(userId, true);
        roomHistory.setACL(acl);
    }

    roomHistory.save(null, {useMasterKey: true});
},{
    fields : ['serialnumber']
});
