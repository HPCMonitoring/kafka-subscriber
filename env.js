require("dotenv").config();

// Setup and start sensor scriber
const KAFKA_BROKER = process.env.KAFKA_BROKER || "localhost:9092";
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || "hello-world-topic";
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID || "hpc-monitoring";
const ES_CERT_PATH = process.env.ES_CERT_PATH || "ca.crt";
const ES_HOST = process.env.ES_HOST || "https://localhost:9200";
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "100");
const LINGER_MS = parseInt(process.env.LINGER_MS || "1000");
const ES_USERNAME = process.env.ELASTIC_USER || "elastic";
const ES_PASSWORD = process.env.ELASTIC_PASSWORD || "abcdef";
const ES_INDEX = process.env.ES_INDEX || "sensor-data";

module.exports = {
    KAFKA_BROKER,
    KAFKA_TOPIC,
    KAFKA_GROUP_ID,
    ES_CERT_PATH, 
    ES_HOST,
    BATCH_SIZE,
    LINGER_MS,
    ES_USERNAME,
    ES_PASSWORD,
    ES_INDEX
}