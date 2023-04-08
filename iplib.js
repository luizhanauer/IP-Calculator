function calculateNetworkData(ipAddress, netmaskBits) {
    const ipArray = ipAddress.split('.').map(Number);
    const netmask = (1 << netmaskBits) - 1 << 32 - netmaskBits;
    const networkAddress = ipArray.map((octet, i) => octet & netmask >> 8 * (3 - i)).join('.');
    const broadcastAddress = ipArray.map((octet, i) => i === 3 ? (octet | ~netmask & 255) : octet | ~netmask >> 8 * (3 - i) & 255).join('.');
    const minIpAddress = networkAddress.split('.').map((octet, i) => i === 3 ? Number(octet) + 1 : octet).join('.');
    const maxIpAddress = broadcastAddress.split('.').map((octet, i) => i === 3 ? Number(octet) - 1 : octet).join('.');
    const numHosts = Math.pow(2, 32 - netmaskBits) - 2;
    const netmaskArray = Array(4).fill(0).map((_, i) => i < netmaskBits / 8 ? 255 : i === Math.floor(netmaskBits / 8) ? 256 - Math.pow(2, 8 - netmaskBits % 8) : 0);
    const netmaskAddress = netmaskArray.join('.');
    return {
      networkAddress,
      broadcastAddress,
      minIpAddress,
      maxIpAddress,
      numHosts,
      netmask: netmaskAddress,
    };
  }
  