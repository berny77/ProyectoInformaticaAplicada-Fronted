import React, { useState } from 'react';

const File: React.FC = () => {
  const [fileData, setFileData] = useState<{
    id: number;
    owner: string;
    fileType: string;
    creationDate: string;
    size: number;
    base64: string;
  } | null>(null);

  const [owner, setOwner] = useState<string>(''); 
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validar el tipo de archivo
      const validTypes = ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Tipo de archivo no permitido. Selecciona un archivo de texto, Excel, PowerPoint, PDF o imagen.');
        return;
      }

      // Leer el archivo como Base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const newFileData = {
          id: 0, 
          owner: owner || 'berny', // Usar el estado del propietario
          fileType: file.type,
          creationDate: new Date().toISOString(),
          size: file.size,
          base64: base64String.split(',')[1] // Extraer la parte Base64
        };
        setFileData(newFileData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Nombre del propietario" 
        value={owner} 
        onChange={(e) => setOwner(e.target.value)} 
      />
      <input type="file" accept=".txt,.docx,.xlsx,.pptx,.pdf,.jpg,.png" onChange={handleFileChange} />
      {fileData && (
        <div>
          <h3>Información del Archivo</h3>
          <p><strong>ID:</strong> {fileData.id}</p>
          <p><strong>Propietario:</strong> {fileData.owner}</p>
          <p><strong>Tipo de archivo:</strong> {fileData.fileType}</p>
          <p><strong>Fecha de creación:</strong> {fileData.creationDate}</p>
          <p><strong>Tamaño:</strong> {fileData.size} bytes</p>
          <p><strong>Base64:</strong> {fileData.base64.substring(0, 50)}... (truncado)</p>
        </div>
      )}
    </div>
  );
};

export default File;