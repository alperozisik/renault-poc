const MCS = require('sf-extension-mcs');
var options = {
    'backendId': 'e7a9f88e-3419-4400-95d0-9ad792bd5abe', //required
    'baseUrl': 'https://smartface-mobilebel.mobileenv.em2.oraclecloud.com', //required
    //'androidApplicationKey': 'YOUR ANDROID APP KEY', //required only for analytics & events
    //'iOSApplicationKey': 'YOUR IOS APP KEY', //required only for analytics & events
    'anonymousKey': 'TU9CSUxFQkVMX1NNQVJURkFDRV9NT0JJTEVfQU5PTllNT1VTX0FQUElEOmZzOXEzakltbm9iX2hw' //required only to perform operations without logging in first
};
var mcs = new MCS(options);

module.exports = exports = mcs;
