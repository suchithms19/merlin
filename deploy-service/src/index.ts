import { createClient } from 'redis';
import { downloadS3Folder } from './utils/download-R2';
const subscriber = createClient();
subscriber.connect();

async function main() {
    while(1) {
        const res = await subscriber.brPop(
            'build-queue',
            0,
          );

        if (!res) continue;
        const id = res.element;

        await downloadS3Folder(`repos/${id}`);
    }
}
main();