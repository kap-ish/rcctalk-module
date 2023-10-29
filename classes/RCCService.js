
const net = require('../modules/net.js')
const crypto = require('crypto')
class RCCService {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
    }

    async HelloWorld() {
        return await net.send(this, [{ "HelloWorld": null }])
    }
    async GetVersion() {
        return await net.send(this, [{ "GetVersion": null }])
    }
    async OpenJob(jobId, script, args, expirationInSeconds, category, cores) {
        /* TYPE CHECKING */
        if (!jobId) { throw new Error("The jobId parameter is required.") }
        if (!script) { throw new Error("The script parameter is required.") }
        jobId = String(jobId)
        args = args || []
        expirationInSeconds = Number(expirationInSeconds) || 300
        category = Number(category) || 0
        cores = Number(cores) || 1
        /* END OF TYPE CHECKING */

        return await net.send(this, [{
            "OpenJob": {
                "job": {
                    "id": jobId,
                    "expirationInSeconds": expirationInSeconds,
                    "category": category,
                    "cores": cores
                },

                "script": {
                    "name": "Starter Script",
                    "script": script,
                    "arguments": args
                }
            }
        }])
    }
    async BatchJob(jobId, script, args, expirationInSeconds, category, cores) {
        /* TYPE CHECKING */
        if (!jobId) { throw new Error("The jobId parameter is required.") }
        if (!script) { throw new Error("The script parameter is required.") }
        jobId = String(jobId)
        args = args || []
        expirationInSeconds = Number(expirationInSeconds) || 300
        category = Number(category) || 0
        cores = Number(cores) || 1
        /* END OF TYPE CHECKING */

        return await net.send(this, [{
            "BatchJob": {
                "job": {
                    "id": jobId,
                    "expirationInSeconds": expirationInSeconds,
                    "category": category,
                    "cores": cores
                },

                "script": {
                    "name": "Starter Script",
                    "script": script,
                    "arguments": args
                }
            }
        }])
    }
    async Execute(jobId, script, args) {
        /* TYPE CHECKING */
        if (!jobId) { throw new Error("The jobId parameter is required.") }
        if (!script) { throw new Error("The script parameter is required.") }
        jobId = String(jobId)
        args = args || []
        /* END OF TYPE CHECKING */

        return await net.send(this, [{
            "Execute": {
                "jobID": jobId,
                "script": {
                    "name": crypto.randomUUID(),
                    "script": script,
                    "arguments": args
                }
            }
        }])
    }
    async RenewLease(jobID, expirationInSeconds) {
        /* TYPE CHECKING */
        if (!jobId) { throw new Error("The jobId parameter is required.") }
        if (!expirationInSeconds) { throw new Error("The expirationInSeconds parameter is required.") }
        jobId = String(jobId)
        expirationInSeconds = Number(expirationInSeconds) || 300
        /* END OF TYPE CHECKING */

        return await net.send(this, [{
            "RenewLease": {
                "jobID": jobID,
                "expirationInSeconds": expirationInSeconds
            }
        }])
    }
    async GetExpiration(jobId) {
        /* TYPE CHECKING */
        if (!jobId) { throw new Error("The jobId parameter is required.") }
        jobId = String(jobId)
        /* END OF TYPE CHECKING */

        return await net.send(this, [{ "GetExpiration": { "jobID": parameters.jobID } }])
    }
    async GetAllJobs() {
        return await net.send(this, [{ "GetAllJobs": null }])

    }
    async CloseJob(jobId) {
        /* TYPE CHECKING */
        if (!jobId) { throw new Error("The jobId parameter is required.") }
        jobId = String(jobId)
        /* END OF TYPE CHECKING */

        return await net.send(this, [{ "CloseJob": { "jobID": parameters.jobID } }])
    }
    async CloseAllJobs() {
        return await net.send(this, [{ "CloseAllJobs": null }])
    }
    async CloseExpiredJobs() {
        return await net.send(this, [{ "CloseExpiredJobs": null }])
    }
}
module.exports = RCCService