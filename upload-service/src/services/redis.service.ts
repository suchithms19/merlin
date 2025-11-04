import { createClient } from 'redis';
import { config } from '../config';

const client = createClient({ url: config.redis.url });
const subscriber = createClient({ url: config.redis.url });

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

const connect = async () => {
    await client.connect();
    await subscriber.connect();
};

const setStatus = async (id: string, status: string) => {
    await client.hSet('status', id, status);
};

const getStatus = async (id: string) => {
    return await client.hGet('status', id);
};

const addToBuildQueue = async (id: string) => {
    await client.lPush('build-queue', id);
};

const disconnect = async () => {
    await client.quit();
    await subscriber.quit();
};

export {
    connect,
    setStatus,
    getStatus,
    addToBuildQueue,
    disconnect
};