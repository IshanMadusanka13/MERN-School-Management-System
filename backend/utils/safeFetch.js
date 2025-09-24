// backend/utils/safeFetch.js
const { URL } = require('url');
const dns = require('dns').promises;
const net = require('net');
const axios = require('axios');

// IPv4 private ranges
const PRIVATE_RANGES = [
  ['10.0.0.0', '10.255.255.255'],
  ['172.16.0.0', '172.31.255.255'],
  ['192.168.0.0', '192.168.255.255'],
  ['127.0.0.0', '127.255.255.255'],
  ['169.254.0.0', '169.254.255.255']
];

function ipv4ToInt(ip) {
  return ip.split('.').reduce((acc, p) => (acc << 8) + parseInt(p, 10), 0) >>> 0;
}

function inPrivateRange(ip) {
  if (net.isIPv6(ip)) return true; // block IPv6 by default (easier)
  const v = ipv4ToInt(ip);
  return PRIVATE_RANGES.some(([s, e]) => ipv4ToInt(s) <= v && v <= ipv4ToInt(e));
}

async function isSafeUrl(userUrl) {
  try {
    const parsed = new URL(userUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    const addrs = await dns.lookup(parsed.hostname, { all: true });
    for (const a of addrs) {
      if (inPrivateRange(a.address)) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

async function safeFetch(userUrl, opts = {}) {
  if (!await isSafeUrl(userUrl)) {
    const err = new Error('URL not allowed');
    err.code = 'SSRF_BLOCKED';
    throw err;
  }

  const axiosOpts = {
    timeout: opts.timeout || 5000,
    maxRedirects: 0,
    responseType: 'text',
    validateStatus: s => s >= 200 && s < 400
  };

  const r = await axios.get(userUrl, axiosOpts);
  return typeof r.data === 'string' ? r.data.slice(0, 2000) : r.data;
}

module.exports = { isSafeUrl, safeFetch };
