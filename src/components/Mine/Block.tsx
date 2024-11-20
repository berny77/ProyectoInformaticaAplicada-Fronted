import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Document } from '../../model/Document'; // Tu modelo existente
import '../../styles/BlockGrid.scss'; // Archivo CSS para estilos

// Definir el modelo de Block para la vista
interface Block {
  id: number;
  miningDate: string;
  attempts: number;
  milliseconds: number;
  hash: string;
  previous_Hash: string;
  documents: Document[];
}

const Block: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [sessionData, setSessionData] = useState(JSON.parse(sessionStorage.getItem('sessionData')!));
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

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

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
  };

  return (
    <div className="block-container">
      <h2>Bloques Minados</h2>
      {blocks.length > 0 ? (
        <table className="block-table">
          <thead>
            <tr>
              <th>Fecha de Minado</th>
              <th>Prueba</th>
              <th>Milisegundos</th>
              <th>Hash</th>
              <th>Hash Previo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.id}>
                <td>{new Date(block.miningDate).toLocaleString()}</td>
                <td>{block.attempts}</td>
                <td>{block.milliseconds}</td>
                <td>{block.hash}</td>
                <td>{block.previous_Hash}</td>
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
        <p>No se encontraron bloques minados.</p>
      )}

      {selectedBlock && (
        <div className="block-details">
          <h3>Documentos del Bloque</h3>
          <table className="document-table">
            <thead>
              <tr>
                <th>Propietario</th>
                <th>Nombre de Archivo</th>
                <th>Tipo de Archivo</th>
                <th>Fecha de Creación</th>
                <th>Tamaño</th>
              </tr>
            </thead>
            <tbody>
              {selectedBlock.documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.owner}</td>
                  <td>{doc.fileName || doc.name || 'N/A'}</td>
                  <td>{doc.fileType}</td>
                  <td>{new Date(doc.creationDate).toLocaleString()}</td>
                  <td>{doc.size}</td>
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
