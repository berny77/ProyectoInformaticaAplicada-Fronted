import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Blockc } from '../../model/Document';
import '../../styles/BlockGrid.scss';

const Block: React.FC = () => {
  const [blocks, setBlocks] = useState<Blockc[]>([]);
  const [sessionData, setSessionData] = useState(JSON.parse(sessionStorage.getItem('sessionData')!));
  const [selectedBlock, setSelectedBlock] = useState<Blockc | null>(null);

  const fetchBlocks = async () => {
    try {
      const response = await fetch(`https://localhost:7001/api/Block/${sessionData.userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionData.token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBlocks(result.data.blocks);
        } else {
          Swal.fire('Error', result.message, 'error');
        }
      } else {
        throw new Error('Error al obtener los bloques.');
      }
    } catch (error) {
      console.error('Error al cargar los bloques:', error);
      Swal.fire('Error', 'No se pudieron cargar los bloques. Intenta más tarde.', 'error');
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleBlockClick = (block: Blockc) => {
    setSelectedBlock(block);
  };

  const getFileTypeDisplayName = (fileType: string): string => {
    if (!fileType) {
      return 'Desconocido';
    }
  
    switch (fileType.toLowerCase()) { 
      case 'pdf':
        return 'PDF';
      case 'text/plain':
        return 'TXT';
      case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Word';
      case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'Excel';
      case 'vnd.ms-excel':
        return 'Excel (antiguo)';
      case 'image/jpeg':
        return 'JPEG';
      case 'image/png':
        return 'PNG';
      default:
        return `Desconocido (${fileType})`;
    }
  };

  return (
    <div className="block-grid-container">
      <h2 className="title">Bloques Minados</h2>
      {blocks.length > 0 ? (
        <table className="block-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Prueba</th>
              <th>Milisegundos</th>
              <th>Hash Previo</th>
              <th>Hash</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.id}>
                <td>{new Date(block.miningDate).toLocaleString()}</td>
                <td>{block.attempts}</td>
                <td>{block.milliseconds}</td>
                <td className="hash-column">{block.previous_Hash}</td>
                <td className="hash-column">{block.hash}</td>
                <td>
                  <button
                    className="details-button"
                    onClick={() => handleBlockClick(block)}
                  >
                    Ver Documentos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No se encontraron bloques minados.</p>
      )}

      {selectedBlock && (
        <div className="block-details">
          <h3 className="details-title">Documentos del Bloque</h3>
          <table className="document-table">
            <thead>
              <tr>
                <th>Propietario</th>
                <th>Tipo</th>
                <th>Creación</th>
                <th>Tamaño</th>
              </tr>
            </thead>
            <tbody>
              {selectedBlock.documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.owner}</td>
                  <td>{getFileTypeDisplayName(doc.fileType)}</td>
                  <td>{new Date(doc.creationDate).toLocaleString()}</td>
                  <td>{doc.size} bytes</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="close-button"
            onClick={() => setSelectedBlock(null)}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default Block;
