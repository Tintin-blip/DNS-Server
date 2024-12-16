import * as dgram from "dgram";
import {DnsHeader, DnsMessage, extractDomain} from './messageDns'

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const header = new DnsHeader()


// Uncomment this block to pass the first stage
const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1");
udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
    try {
        console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}, ${data[0]}`);
        const packetId = (data[0] << 8) | data[1];
        const domain = extractDomain(data)

        header.Packet_Identifier = packetId 
        const defaultMessage = new DnsMessage(domain,header);


        const response = defaultMessage.getMessage();
        udpSocket.send(response,0,response.length , remoteAddr.port, remoteAddr.address);

    } catch (e) {
        console.log(`Error sending data: ${e}`);
    }
});



