const moment = require('moment')


queue = {};
function queueing(data, ms, callback) {
    key = generateKey(data)

    value = queue[key];
    if (value == null) {
        // データが無い場合はキューに追加
        queue[key] = data;
        callback(data);
    } else {
        // データがある場合は時間差を計算
        const diff = moment(data.created).diff(moment(value.created))
        if (diff > ms) {
            queue[key] = data;
            callback(data);
        }
    }
};

function generateKey(data) {
    return data.uuid + ":" + data.major + ":" + data.minor;
}

module.exports = {
    queueing
}