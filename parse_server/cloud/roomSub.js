Parse.Cloud.define("updateRoom", async (request) => {
    const deviceQuery = new Parse.Query("Device");
    deviceQuery.equalTo("SerialNumber", request.params.serialnumber);

    const roomQuery = new Parse.Query("Room");
    roomQuery.matchesQuery("Device", deviceQuery);

    var room = await roomQuery.first({ useMasterKey: true });
    if (room == null) return;

    switch (request.params.name) {
        case "humidity":     room.set("relativeHumidity", Number(request.params.value)); break;
        case "pressure":     room.set("pressure", Number(request.params.value)); break;
        case "temperature":  room.set("temperature", Number(request.params.value)); break;
        case "voc":          room.set("voc", Number(request.params.value)); break;
        case "co2":          room.set("co2", Number(request.params.value)); break;
    }

    await room.save(null, {useMasterKey: true});
},{
    fields : ['serialnumber']
});
