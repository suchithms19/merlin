import { createClient } from 'redis';
const subscriber = createClient();
subscriber.connect();

async function main() {
    while(1) {
        const res = await subscriber.brPop(
            'build-queue',
            0,
          );
        console.log('Received build job:', res);
    }
}
main();