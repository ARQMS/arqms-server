Parse.Cloud.define("updateRoom", async (request) => {
    const deviceQuery = new Parse.Query("Device");
    deviceQuery.equalTo("SerialNumber", request.params.serialnumber);

    const roomQuery = new Parse.Query("Room");
    roomQuery.matchesQuery("Device", deviceQuery);

    var room = await roomQuery.first({ useMasterKey: true });
    if (room == null) {
        return;
    }

    const info = request.params.value;
    room.set("relativeHumidity", info.Humidity);
    room.set("pressure", info.Pressure);
    room.set("temperature", info.Temperature);
    room.set("voc", info.VOC);
    room.set("co2", info.CO2);
       
    await room.save(null, {useMasterKey: true});

    // create history item
    const RoomHistory = Parse.Object.extend("RoomHistory");
    var roomHistory = new RoomHistory();
    roomHistory.set("room", room);
    roomHistory.set("relativeHumidity", info.Humidity);
    roomHistory.set("pressure", info.Pressure);
    roomHistory.set("temperature", info.Temperature);
    roomHistory.set("voc", info.VOC);
    roomHistory.set("co2", info.CO2);

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
