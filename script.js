function Calcular() {

  const address = document.getElementById('ip-address').value;
  console.log('address: ' + address);
  const netmask = document.getElementById('netmask-bits').value;
  console.log('Netmask: ' + netmask);
  let netmaskAddress = cidrToNetmask(netmask);
  console.log('netmask Address: ' + netmaskAddress);

  let networkAddress = calculateNetworkAddress(address, netmask);
  console.log('network Address: ' + networkAddress);
  let calcMinHost = calculateMinHost(address, netmask);
  console.log('address MinHost: ' + calcMinHost);
  let calcMaxHost = calculateMaxHost(address, netmask);
  console.log('address MaxHost: ' + calcMaxHost);
  let broadcast = calculateBroadcastAddress(address, netmask);
  console.log('broadcast Address: ' + broadcast);

  let hosts = calculateNumHosts(netmask);
  console.log('hosts: ' + hosts);

  // Preencher a tabela
  document.getElementById('address').innerHTML = address;
  document.getElementById('address-binary').innerHTML = ipToBinaryFormated(address);
  document.getElementById('network').innerHTML = networkAddress+'/'+netmask;
  document.getElementById('network-binary').innerHTML = ipToBinaryFormated(networkAddress);
  document.getElementById('netmask').innerHTML = netmaskAddress;
  document.getElementById('netmask-binary').innerHTML = ipToBinaryFormated(netmaskAddress);
  document.getElementById('broadcast-address').innerHTML = broadcast;
  document.getElementById('broadcast-address-binary').innerHTML = ipToBinaryFormated(broadcast);
  document.getElementById('min-host').innerHTML = calcMinHost;
  document.getElementById('min-host-binary').innerHTML = ipToBinaryFormated(calcMinHost);
  document.getElementById('max-host').innerHTML = calcMaxHost;
  document.getElementById('max-host-binary').innerHTML = ipToBinaryFormated(calcMaxHost);
  document.getElementById('num-hosts').innerHTML = hosts;

  // obter a tabela e as seções do cabeçalho e do corpo
  const table = document.getElementById('results-table');
  const tbody = table.getElementsByTagName('tbody')[0];
  const thead = table.getElementsByTagName('thead')[0];

  // criar nova linha no corpo da tabela
  const newRow = tbody.insertRow(0);

  // preencher nova linha com resultados
  newRow.insertCell().innerHTML = address;
  newRow.insertCell().innerHTML = netmaskAddress;
  newRow.insertCell().innerHTML = networkAddress+'/'+netmask;
  newRow.insertCell().innerHTML = broadcast;
  newRow.insertCell().innerHTML = calcMinHost;
  newRow.insertCell().innerHTML = calcMaxHost;
  newRow.insertCell().innerHTML = hosts;

  // mover o thead para o topo da tabela (se ainda não estiver lá)
  if (table.firstChild !== thead) {
    table.insertBefore(thead, table.firstChild);
  }

    // Seleciona todas as linhas <tr> no corpo da tabela
    let rows = document.querySelectorAll('tbody tr');
  
    // Adiciona as classes do Tailwind CSS às linhas da tabela
    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.add('hover:bg-gray-200');
      if (i % 2 === 0) {
        rows[i].classList.add('even:bg-gray-50');
      }
      
      // Seleciona todas as células <td> dentro da linha
      let cells = rows[i].querySelectorAll('td');
      
      // Adiciona a classe 'border' a cada célula <td>
      for (let j = 0; j < cells.length; j++) {
        cells[j].classList.add('border', 'text-center');
      }
    }
    
}

function LimparTabela() {
  // encontra a tabela e o corpo da tabela
  const table = document.getElementById('results-table');
  const tbody = table.getElementsByTagName('tbody')[0];

  // remove todas as linhas do corpo da tabela
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}

function cidrToNetmask(netmask) {
  let mask = [0, 0, 0, 0];
  for (let i = 0; i < netmask; i++) {
      mask[Math.floor(i / 8)] += 1 << (7 - i % 8);
  }
  return mask.join('.');
}

function calculateBroadcastAddress(ip, prefixLength) {
  const ipArray = ip.split('.').map(Number);

  const subnetMask = Array(4).fill(0).map((_, i) => {
      if (prefixLength >= 8) {
          prefixLength -= 8;
          return 255;
      } else {
          const octet = 256 - Math.pow(2, 8 - prefixLength);
          prefixLength = 0;
          return octet;
      }
  }).join('.');

  const networkAddress = ipArray.map((octet, i) => octet & subnetMask.split('.')[i]).join('.');

  const invertedSubnetMask = subnetMask.split('.').map(octet => 255 - octet).join('.');
  const broadcastAddress = networkAddress.split('.').map((octet, i) => (Number(octet) | Number(invertedSubnetMask.split('.')[i]))).join('.');

  return broadcastAddress;
}

function ipToBinary(ip) {
  // Separar os quatro octetos do endereço IP
  var octetos = ip.split('.');

  // Converter cada octeto para notação binária com 8 bits
  var binario = '';
  for (var i = 0; i < octetos.length; i++) {
      var octetoBinario = parseInt(octetos[i], 10).toString(2);
      while (octetoBinario.length < 8) {
          octetoBinario = '0' + octetoBinario;
      }
      binario += octetoBinario;
  }
  return binario;
}

function ipToBinaryFormated(ip) {
  // Separar os quatro octetos do endereço IP
  var octetos = ip.split('.');

  // Converter cada octeto para notação binária com 8 bits
  var binario = '';
  for (var i = 0; i < octetos.length; i++) {
      var octetoBinario = parseInt(octetos[i], 10).toString(2);
      while (octetoBinario.length < 8) {
          octetoBinario = '0' + octetoBinario;
      }
      binario += octetoBinario;
      if (i !== octetos.length - 1) { // adiciona ponto em todos os octetos menos no último
          binario += '.';
      }
  }
  return binario;
}

function calculateNetworkAddress(ip, prefixLength) {
  const ipArray = ip.split('.').map(Number);

  const subnetMask = cidrToNetmask(prefixLength);

  const networkAddress = ipArray.map((octet, i) => octet & subnetMask.split('.')[i]).join('.');

  return networkAddress;
}

function calculateNumHosts(prefixLength) {
  if (prefixLength === 32) {
    return 0;
  }
  const hosts = Math.pow(2, 32 - prefixLength) - 2;
  return hosts;
}

function binaryToIp(binary) {
  const octets = [];
  for (let i = 0; i < 32; i += 8) {
      octets.push(parseInt(binary.slice(i, i + 8), 2));
  }
  return octets.join('.');
}

function calculateMinHost(ip, prefixLength) {
  const networkAddress = calculateNetworkAddress(ip, prefixLength);
  return binaryToIp(ipToBinary(networkAddress).slice(0, -1) + '1');
}

function calculateMaxHost(ip, prefixLength) {
  const networkAddress = calculateNetworkAddress(ip, prefixLength);
  const numHosts = numHosts(netmask);
  return binaryToIp(ipToBinary(networkAddress).slice(0, -1) + (numHosts - 1).toString(2).padStart(31, '0'));
}

function calculateMaxHost(ip, prefixLength) {
  const numHosts = calculateNumHosts(prefixLength);
  const lastAddress = calculateBroadcastAddress(ip, prefixLength);
  const lastAddressBinary = ipToBinary(lastAddress);
  const maxHostBinary = lastAddressBinary.slice(0, -1) + '0';
  const maxHost = binaryToIp(maxHostBinary);
  return maxHost;
}

document.getElementById("network-form").addEventListener("submit", function(event) {
  event.preventDefault(); // interrompe o envio do formulário
  Calcular(); // chama sua função desejada
});

let clipboard = new ClipboardJS('.btn');

clipboard.on('success', function (e) {
    //console.log(e);
    alert('Copiado para área de transferência!');
});

clipboard.on('error', function (e) {
    //console.log(e);
});