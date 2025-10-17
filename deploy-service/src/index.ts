import { createClient } from 'redis';
import { downloadS3Folder } from './utils/download-R2';
import { buildProject } from './utils/child-process';
import { copyFinalDist } from './utils/copy-final-dist';
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
        await buildProject(id);
        await copyFinalDist(id);
    }
}
main();