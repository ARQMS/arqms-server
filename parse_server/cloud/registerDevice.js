Parse.Cloud.define("registerDevice", async (request) => {
    const user = request.user;

    // ACL
    const userACL = new Parse.ACL(user);

    // Setup device
    const Device = Parse.Object.extend("Device");
    const device = new Device();
    device.setACL(userACL);
    device.set("SerialNumber", request.params.serialnumber);
    await device.save();
},{
    fields : ['serialnumber'],
    requireUser: true
});
