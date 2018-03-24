const beaconQueue = require('./lib/beaconQueue')
const httpRequest = require('./lib/httpRequest')

// detector設定チェック
//const detector = process.env.PI_DETECTOR;
const detector = 'pi'
if (detector == null) {
    console.error("Environment variable of PI_DETECTOR is required.");
    return 0;
}

/**
 * ビーコン発見時に呼び出すメソッド
 * @param {*} beaconData 
 */
function findBeacon(beaconData, callback) {
    // データに生成時間を付与(キューイング管理用)
    beaconData.created = new Date();
    // キューイング
    beaconQueue.queueing(beaconData, 1000 * 60, (data) => {
        // ログ出力
        console.log(data);

        // publishするデータを生成
        var publishData = {
            detector: detector,
            uuid: data.uuid,
            major: data.major,
            minor: data.minor,
        };
        // httpリクエスト送信
        httpRequest(publishData, (err) => {
            if (err != 200 && callback) callback('http error ' + err);
        });
    });
}


function callBeacon1() {
    data = {
        uuid: "AAAAAAA",
        major: 0,
        minor: 0,
    }

    findBeacon(data, (err) => {
        if (err) console.log(err);
    });

    setTimeout(callBeacon1, 1000);
}

var Bleacon = require("bleacon");
Bleacon.startScanning();
Bleacon.on("discover", function(bleacon) {
    findBeacon(bleacon, (err) => {
        if (err) console.log(err);
    });
});

