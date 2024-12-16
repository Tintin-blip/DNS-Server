
interface HeaderFormat { 
    Packet_Identifier:number;
    Response_Indicator:boolean,
    Operation_Code:number,
    Authoritative_Answer:boolean,
    Truncation:boolean,
    Recursion_Desired:boolean,
    Recursion_Available:boolean,
    Reserved:number,
    Response_Code:number,
    Question_Count:number,
    Answer_Record_Count:number,
    Authority_Record_Count:number,
    Additional_Record_Count:number,
 
}

export class DnsHeader implements HeaderFormat{ 
    
    Packet_Identifier=1234
    Response_Indicator=true
    Operation_Code=0
    Authoritative_Answer=false
    Truncation=false
    Recursion_Desired=false
    Recursion_Available=true
    Reserved=0
    Response_Code=0
    Question_Count=1
    Answer_Record_Count=0
    Authority_Record_Count=0
    Additional_Record_Count=0

    encode(){ 
        const arrayOfBytes =new Uint8Array(12);
        // ID

        // arrayOfBytes[0] - arrayOfBytes[1] // 0000 0000 0000 0000   
        arrayOfBytes[0] = (this.Packet_Identifier >> 8)   & 0xff // Shift Packet 8 bits to the right to remove the remaining bits
        arrayOfBytes[1] = this.Packet_Identifier & 0xff

        // QR, OP, AA, TC, RD
        let byte = 0; 

        // Set the first bit for Response_Indicator (QR) if true
        if (this.Response_Indicator) byte = 0b10000000; // If true, byte = 1000 0000 (QR is 1)
        
        // Shift the Operation_Code 3 bits to the left and set the next 4 bits
        byte |= this.Operation_Code << 3; // Set bits 1, 2, 3, 4 for Operation_Code
        
        // Set the 5th bit for Authoritative_Answer if true
        if (this.Authoritative_Answer) byte |= 0b00000100; // Set bit 5 for AA
        
        // Set the 6th bit for Truncation if true
        if (this.Truncation) byte |= 0b00000010; // Set bit 6 for TC
        
        // Set the 7th bit for Recursion_Desired if true
        if (this.Recursion_Desired) byte |= 0b00000001; // Set bit 7 for RD
        
        // Store the byte in the correct position in the byte array (index 2)
        arrayOfBytes[2] = byte;

        byte = 0;
        if (this.Recursion_Available) byte |= 0b10000000;
        byte |= this.Reserved << 3;
        byte |= this.Response_Code;
    
        arrayOfBytes[3] = byte

        // QC
        arrayOfBytes[4] = (this.Question_Count >> 8)   & 0xff // Shift Packet 8 bits to the right to remove the remaining bits
        arrayOfBytes[5] = this.Question_Count & 0xff
  
        // ARC 
        arrayOfBytes[6] = (this.Answer_Record_Count >> 8)   & 0xff // Shift Packet 8 bits to the right to remove the remaining bits
        arrayOfBytes[7] = this.Answer_Record_Count & 0xff
        // AURC 
        arrayOfBytes[8] = (this.Authority_Record_Count >> 8)   & 0xff // Shift Packet 8 bits to the right to remove the remaining bits
        arrayOfBytes[9] = this.Authority_Record_Count & 0xff
        // AURC 
        arrayOfBytes[10] = (this.Additional_Record_Count >> 8)   & 0xff // Shift Packet 8 bits to the right to remove the remaining bits
        arrayOfBytes[11] = this.Additional_Record_Count & 0xff
        
        return arrayOfBytes
    }
    getBytes() {
        return this.encode()
    }
 
} 




export class DnsQuestion { 
    public dnsNames: DnsNames
    public name:string
    private type:number = 1;
    private class:number = 1;
    constructor(name:string) { 
        this.name = name
        this.dnsNames = new DnsNames(this.name);
    }
    
    encode() {
    

    const bytesOfName = this.dnsNames.getDnsNames()

    const arrayOfBytes = new Uint8Array(bytesOfName.length + 4) // TYPE AND CLASS
        arrayOfBytes.set(bytesOfName)
            // Agregar TYPE y CLASS al final
        arrayOfBytes[bytesOfName.length] = (this.type >> 8) & 0xff; // HIGH TYPE
        arrayOfBytes[bytesOfName.length + 1] = this.type & 0xff;    // LOW TYPE

        arrayOfBytes[bytesOfName.length + 2] = (this.class >> 8) & 0xff; // HIGH CLASS
        arrayOfBytes[bytesOfName.length + 3] = this.class & 0xff;        // LOW CLASS
        return arrayOfBytes;
    }
}



class DnsNames { 
    private labels:Array<any>;
    private name: string;
   
    constructor(name:string) {

        this.name = name
        this.labels= [];
    }
        public getDnsNames()  {
            const split = this.name.split('.')
            
            for (const label of split) {
                // calcule length  
                this.labels.push(label.length.toString(16).padStart(2, "0"));
                // Convert every character to ASCII Hex
                for (const char of label) {
                    this.labels.push(char.charCodeAt(0).toString(16).padStart(2, "0"));
                }
            }
           this.labels.push("00")
           this.labels = this.labels.map( label => parseInt(label,16))
            

            return this.labels

        }
}


export class DnsMessage {
    private header: DnsHeader;
    private question: DnsQuestion;

    constructor(domainName: string,header:DnsHeader) {
        this.header = header
        this.question = new DnsQuestion(domainName);
    }

    public getMessage() {
        const headerBytes = this.header.encode();
        const questionBytes = this.question.encode();

        const totalLength = headerBytes.length  + questionBytes.length
        const dnsMessage = new Uint8Array(totalLength);

        dnsMessage.set(headerBytes, 0);
        dnsMessage.set(questionBytes, headerBytes.length);

        
      console.log(dnsMessage)
      return dnsMessage;
    }
}


export const extractDomain = (data:Buffer) => { 
    if(!data) throw new Error('No length')
    let labels = ""
    let index = 12
    while (data[index] !== 0) { // continue while data[i] dont be 0
        const length = data[index]; // read really length
        index++;

        for (let i = 0; i < length; i++) {
            labels += String.fromCharCode(data[index]);
            index++;
        }

        labels += '.'
    }

    console.log(labels.slice(0, -1)) // delete trash
    return labels.slice(0,-1)
}