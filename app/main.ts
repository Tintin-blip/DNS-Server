import * as dgram from "dgram";
import {DnsFormat} from './messageDns'

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const defaultMessage = new DnsFormat()


// Uncomment this block to pass the first stage
const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1");
udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
    try {
        console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}, ${data}`);
        const response = defaultMessage.encode();
        udpSocket.send(response,0,response.length , remoteAddr.port, remoteAddr.address);

    } catch (e) {
        console.log(`Error sending data: ${e}`);
    }
});



