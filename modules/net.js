const network = require('node:net');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const isValidHostname = require('is-valid-hostname');
const xml = require('./xml.js');

let error = null;
const hostname = {
    ip: null,
    port: null
};

async function fetchWithTimeout(resource, options = {}) {
    let { timeout = 60000 } = options;

    let controller = new AbortController();
    let id = setTimeout(() => controller.abort(), timeout);

    let response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });

    clearTimeout(id);

    return response;
}

function sanitizeHostname(hostname) {
    if (!hostname.length) {
        return null;
    }

    let split = hostname.split(":");
    if (split.length < 0 || split.length > 2) {
        return null;
    }

    if (!network.isIPv4(split[0])) {
        if (!isValidHostname(split[0])) {
            return null;
        }
    }

    let ip = split[0];
    let port = 64989;

    if (split.length == 2) {
        port = parseInt(split[1]);
        if (isNaN(port)) {
            return null;
        }

        if (port < 0 || port > 65535) {
            return null;
        }
    }

    return { ip, port };
}

function formatHostname(hostname) {
    return hostname.ip + (hostname.port == 64989 ? "" : ":" + port);
}

function getFormattedHostname() {
    return formatHostname(hostname);
}

function isConnected() {
    return hostname.ip !== null && hostname.port !== null;
}

function fault() {
    let result = error;
    error = null;
    return result;
}

async function connect(ip, port) {
    const rccClass = require("../classes/RCCService.js")
    try {
        let response = await fetchWithTimeout(`http://${ip}:${port}/`, {
            method: "POST",
            body: xml.generateEnvelope([{ "HelloWorld": null }]),
            timeout: 60000,
            headers: {
                "Content-Type": "application/xml"
            }
        });

        let text = await response.text();
        let parsed = xml.parseEnvelope(text);

        if (!parsed.success) {
            throw new Error(`Error in response (${parsed.error})`);
        }
    } catch (e) {
        error = `Failed to connect to RCCService instance: ${e}`;
        throw new Error(error);
    }
    return new rccClass(ip, port);
}

function disconnect() {
    hostname.ip = null;
    hostname.port = null;
}

async function send(RCCData, data) {
    let envelope = xml.generateEnvelope(data);
    let response = null;

    try {
        response = await fetchWithTimeout(`http://${RCCData.ip}:${RCCData.port}/`, {
            method: "POST",
            body: envelope,
            timeout: 60000,
            headers: {
                "Content-Type": "application/xml"
            }
        });
    } catch (e) {
        error = `Failed to send data to RCCService instance: ${e}`;
        throw new Error(error);
    }

    if (response != null) {
        let parsed = xml.parseEnvelope(await response.text());
        if (parsed.error) {
            error = `${parsed.error}`;
            throw new Error(error);
        }
        response = parsed.data || parsed.success;
    }

    return response;
}

module.exports = { sanitizeHostname, formatHostname, getFormattedHostname, isConnected, fault, connect, disconnect, send };
