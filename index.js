const beaconGcf = require('beacon_gcf')

const beaconQueue = require('./lib/beaconQueue')

// detector設定チェック
const detector = process.env.PI_DETECTOR;
if (detector == null) {
    console.error("Environment variable of PI_DETECTOR is required.");
    return 0;
}

// GCPの認証情報チェック
// if (process.env.GOOGLE_APPLICATION_CREDENTIALS == null) {
//     console.error("Environment variable of GOOGLE_APPLICATION_CREDENTIALS is required.")
//     return 0;
// }

/**
 * ビーコン発見時に呼び出すメソッド
 * @param {*} beaconData 
 */
function findBeacon(beaconData) {
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
        }
        // gcpにpublishする
        beaconGcf.beaconPublish(publishData, (err) => {
            if (err) console.log(err);
        });
    });
}


function callBeacon1() {
    data = {
        uuid: "AAAAAAA",
        major: 0,
        minor: 0,
    }

    findBeacon(data);

    setTimeout(callBeacon1, 1000);
}

callBeacon1()
