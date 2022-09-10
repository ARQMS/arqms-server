// It is best practise to organize your cloud functions group into their own file. You can then import them in your main.js.

function handleRoomInfo(topic, json) {
    let pattern = /^devices\/(?<sn>.*)\/room\/info/g;
    
    while (result = pattern.exec(topic)) {
        var sn = result.groups.sn;

        const param = {
            serialnumber: sn,
            humidity: json.Humidity,
            pressure: json.Pressure,
            temperature: json.Temperature,
            gasResistance: json.GasResistance
        };

        Parse.Cloud.run("updateRoom", param);
    }
}

function handleDeviceInfo(topic, json) {
    let pattern = /^devices\/(?<sn>.*)\/status/g;
    
    console.log(topic);

    while (result = pattern.exec(topic)) {
        var sn = result.groups.sn;

        const param = {
            serialnumber: sn,
            batteryLevel: json.BatteryLevel,
            wifiRssi: json.WifiRssi,
            uptime: json.RunningTime
        };

        Parse.Cloud.run("updateDevice", param);
    }
}

exports.handleMsg = function (topic, message) {
    var json = JSON.parse(message.toString());

    console.log("Topic: " + topic + ": " + message);

    handleRoomInfo(topic, json);
    handleDeviceInfo(topic, json);
}

