// It is best practise to organize your cloud functions group into their own file. You can then import them in your main.js.

exports.handleMsg = function (topic, message) {
    let regRoomPattern = /^devices\/(?<sn>.*)\/room\/(?<name>.*)/g;
    
    while (result = regRoomPattern.exec(topic)) {
        var sn = result.groups.sn;
        var data = result.groups.name;

        const param = {
            serialnumber: sn,
            name: data,
            value: JSON.parse(message.toString())
        };

        Parse.Cloud.run("updateRoom", param);
    }
}