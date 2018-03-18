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
    // データにdetectorを付与
    beaconData.detector = detector;
    // データに生成時間を付与(キューイング管理用)
    beaconData.created = new Date();
    // キューイング
    beaconQueue.queueing(beaconData, 1000 * 60, (data) => {

        // ログ出力
        console.log(data);
        // createdはgcp側で付与するのでnullを設定
        data.created = null;
        // gcpにpublishする
        beaconGcf.beaconPublish(data, (err) => {
            if (err) console.log(err);
        });

    });
}


function callBeacon1() {
    data = {
        uuid: "AAAAAAA",
        major: 0,
        minor: 0,
        created: new Date(),
    }

    findBeacon(data);

    setTimeout(callBeacon1, 1000);
}

callBeacon1()
