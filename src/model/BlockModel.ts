export interface Document {
    id: number;
    owner: string;
    fileType: string;
    creationDate: string;
    size: number;
  }
  
  export interface Block {
    id: number;
    miningDate: string;
    attempts: number;
    milliseconds: number;
    hash: string;
    previous_Hash: string;
    documents: Document[];
  }
  