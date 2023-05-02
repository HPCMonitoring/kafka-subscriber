const Kafka = require('kafkajs').Kafka;
const Client = require('@elastic/elasticsearch').Client;
const readFileSync = require('fs').readFileSync

const LOG_CONTEXT = "Scriber";

const _sensorStats = []
let _config = undefined;
let esClient = undefined;
let kafkaConsumer = undefined;

const doSaveStat = async (stats) => {
    console.info(`[${LOG_CONTEXT}] going to index ${stats.length} items in to elastisearch`);
    const now = new Date();
    const operations = stats.flatMap((doc) => [{ index: { _index: _config?.esIndex } }, { ...doc, ts: now.toISOString() }]);
    esClient
        .bulk({
            refresh: true,
            operations
        })
        .then(() => {
            console.info(`[${LOG_CONTEXT}] index ${stats.length} items succesfully`);
        })
        .catch((err) => {
            console.error(`[${LOG_CONTEXT}] fail to index ${stats.length} items with error message ${err}`);
        });
}

const setConfig = (config) => _config = config
const startScriber = async () => {
    if (!_config) {
        console.error(`[${LOG_CONTEXT}] Scriber config is not set`)
        return
    }
    esClient = new Client({
        node: _config.esHost,
        auth: {
            username: _config.esUserName,
            password: _config.esPasswd
        },
        tls: {
            ca: readFileSync(_config.esCertPath),
            rejectUnauthorized: false
        }
    })
    const kafka = new Kafka({
        brokers: [_config.kafkaBroker]
    });

    kafkaConsumer = kafka.consumer({ groupId: _config.kafkaGroupId });
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({
        topic: _config.kafkaTopic,
        fromBeginning: false
    });

    // Linger check
    setInterval(async () => {
        if (_sensorStats.length > 0) {
            const messageToSent = _sensorStats.splice(0, _sensorStats.length);
            doSaveStat(messageToSent);
        }
    }, _config.lingerMs);

    await kafkaConsumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;
            _sensorStats.push(JSON.parse(message.value.toString()));
            if (_sensorStats.length >= _config.batchSize) {
                const statsToSent = _sensorStats.splice(0, _sensorStats.length);
                doSaveStat(statsToSent);
            }
        }
    });
}


module.exports = {
    setConfig,
    startScriber
}
