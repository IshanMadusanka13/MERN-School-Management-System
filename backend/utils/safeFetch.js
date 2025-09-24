// backend/utils/safeFetch.js
const { URL } = require('url');
const dns = require('dns').promises;
const net = require('net');
const axios = require('axios');

const PRIVATE_RANGES = [
  ['10.0.0.0', '10.255.255.255'],
  ['172.16.0.0', '172.31.255.255'],
  ['192.168.0.0', '192.168.255.255'],
  ['127.0.0.0', '127.255.255.255'],
  ['169.254.0.0', '169.254.255.255']
];

function ipv4ToInt(ip) {
  return ip.split('.').reduce((acc, p) => (acc << 8) + parseInt(p, 10), 0);
}

function inPrivateRange(ip) {
  if (net.isIPv6(ip)) return true; // Block IPv6
  const ipInt = ipv4ToInt(ip);
  return PRIVATE_RANGES.some(([start, end]) => {
    return ipv4ToInt(start) <= ipInt && ipInt <= ipv4ToInt(end);
  });
}

async function isSafeUrl(userUrl) {
  try {
    const parsed = new URL(userUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    const hostname = parsed.hostname;
    const addrs = await dns.lookup(hostname, { all: true });
    for (const a of addrs) {
      if (inPrivateRange(a.address)) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

async function safeFetch(userUrl) {
  if (!await isSafeUrl(userUrl)) {
    const err = new Error('URL not allowed');
    err.code = 'SSRF_BLOCKED';
    throw err;
  }

  const resp = await axios.get(userUrl, { timeout: 5000, maxRedirects: 0 });
  return typeof resp.data === 'string' ? resp.data.slice(0, 2000) : resp.data;
}

module.exports = { safeFetch };
