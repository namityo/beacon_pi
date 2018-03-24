const moment = require('moment')


queue = {};
function queueing(data, ms, callback) {
    key = generateKey(data)

    value = queue[key];
    if (value != null) {
        // データがある場合は時間差を計算
        const diff = moment(data.created).diff(moment(value.created));
        // 比較した時間が指定時間より短い場合は処理中
        if (diff < ms) return;
    }

    // データが無い場合はキューに追加
    queue[key] = Object.assign({}, data);
    callback(data);
};

function generateKey(data) {
    return data.uuid + ":" + data.major + ":" + data.minor;
}

module.exports = {
    queueing
}