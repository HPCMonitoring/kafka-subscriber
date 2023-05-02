const envs = require('./env')
const kafkaScriber = require('./kafkaScriber')

const scriberConfig = {
    batchSize: envs.BATCH_SIZE,
    lingerMs: envs.LINGER_MS,
    kafkaBroker: envs.KAFKA_BROKER,
    kafkaTopic: envs.KAFKA_TOPIC,
    kafkaGroupId: envs.KAFKA_GROUP_ID,
    esCertPath: envs.ES_CERT_PATH,
    esHost: envs.ES_HOST,
    esUserName: envs.ES_USERNAME,
    esPasswd: envs.ES_PASSWORD,
    esIndex: envs.ES_INDEX
};

kafkaScriber.setConfig(scriberConfig);
kafkaScriber.startScriber();