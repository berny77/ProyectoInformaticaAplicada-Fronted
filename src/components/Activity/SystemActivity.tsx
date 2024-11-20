import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../styles/SystemLog.scss";

interface SystemLog {
  id: number;
  action: string;
  user: string | null;
  timestamp: string;
  details: string | null;
}

interface SystemLogState {
  logs: SystemLog[];
  loading: boolean;
  error: string | null;
}

class SystemLogGrid extends Component<{}, SystemLogState> {
  state: SystemLogState = {
    logs: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchSystemLogs();
  }

  getAuthToken = () => {
    const sessionData = sessionStorage.getItem("sessionData");
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      return parsedSession.token;
    }
    return null;
  };

  async fetchSystemLogs() {
    const token = this.getAuthToken();
    if (!token) {
      this.setState({ error: "No se encontró el token de autenticación", loading: false });
      return;
    }

    try {
      const response = await axios.get("https://localhost:7001/api/SystemLog", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.setState({ logs: response.data, loading: false });
    } catch (error: any) {
      this.setState({ error: error.message, loading: false });
    }
  }

  formatDetails(details: string | null) {
    if (!details) return "Sin detalles";
    try {
      const parsedDetails = JSON.parse(details);
      const formattedDetails = JSON.stringify(parsedDetails, null, 2); // Formato legible
      return formattedDetails.length > 100
        ? `${formattedDetails.substring(0, 100)}...` // Limitar longitud
        : formattedDetails;
    } catch {
      return details.length > 100 ? `${details.substring(0, 100)}...` : details; // Texto plano truncado
    }
  }

  render() {
    const { logs, loading, error } = this.state;

    return (
      <div className="system-log-container">
        <h2>Registro de Actividades del Sistema</h2>
        {loading ? (
          <p>Cargando registros...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table className="document-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Acción</th>
                  <th>Usuario</th>
                  <th>Fecha y Hora</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={log.id}>
                    <td>{index + 1}</td>
                    <td>{log.action}</td>
                    <td>{log.user || "Desconocido"}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>
                      <pre className="log-details">{this.formatDetails(log.details)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default SystemLogGrid;
