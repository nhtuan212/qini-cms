type WorkerType = "encryptPassword";

export const runWorker = <T>(WorkerType: WorkerType, data: T) => {
    return new Promise((resolve, reject) => {
        /**
         * First: Declare type WorkerType = "encryptPassword" | "list2"
         * list2: new Worker(new URL("./file.worker.ts", import.meta.url)),
         */
        const workerList = {
            encryptPassword: new Worker(new URL("./encrypt.worker.ts", import.meta.url)),
        };

        // Create worker
        const worker = workerList[WorkerType];

        // Listening worker response
        worker.onmessage = ({ data }) => {
            resolve(data);
            worker.terminate();
        };

        worker.onerror = err => {
            console.log({ err });
            reject(err);
            worker.terminate();
        };

        // Sent data to worker
        worker.postMessage(data);
    });
};
