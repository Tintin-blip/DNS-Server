
export class DnsFormat implements HeaderFormat { 

    Packet_Identifier=44834
    Response_Indicator=true
    Operation_Code=0
    Authoritative_Answer=false
    Truncation=false
    Recursion_Desired=false
    Recursion_Available=true
    Reserved=0
    Response_Code=0
    Question_Count=0
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

} 

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
