import crypto from "crypto";
import { parentPort, workerData } from "worker_threads";

try {
    const hmac  =  crypto.createHmac("sha256", "secret");
    const {signature, payload} = workerData;
    hmac.update(payload, "utf8");
    const data = "sha256=" + hmac.digest("hex");
    const digestBuffer = Buffer.from(data, "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");
    if(signatureBuffer.length !== digestBuffer.length) {
        parentPort?.postMessage({valid:false});
    }
    else if(!crypto.timingSafeEqual(signatureBuffer, digestBuffer)) {
        parentPort?.postMessage({valid: false});
    }
    else {
        parentPort?.postMessage({valid: true});
    }
} catch (e:any) {
    parentPort?.postMessage({valid: false, error: e.message});
}