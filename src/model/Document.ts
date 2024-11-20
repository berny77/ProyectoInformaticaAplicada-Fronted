export interface Document {
    id: number;
    owner: string;
    fileType: string;
    fileName: string;
    creationDate: string;
    size: string;
    doc_encode: string;
    name?: string;
  }

  export interface Blockc {
    id: number;
    miningDate: string;
    attempts: number;
    milliseconds: number;
    hash: string;
    previous_Hash: string;
    documents: Document[];
  }
  