Parse.Cloud.define("updateDevice", async (request) => {
    const deviceQuery = new Parse.Query("Device");
    deviceQuery.equalTo("SerialNumber", request.params.serialnumber);

    var device = await deviceQuery.first({ useMasterKey: true });
    if (device == null) {
        return;
    }

    device.set("rssi", request.params.wifiRssi);
    device.set("battery", request.params.batteryLevel);

    device.save(null, {useMasterKey: true});
},{
    fields : ['serialnumber']
});
