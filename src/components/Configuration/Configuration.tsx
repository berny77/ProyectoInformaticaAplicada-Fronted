import React, { Component } from "react";
import axios from "axios";
import '../../styles/Configuration.scss';
import Swal from 'sweetalert2';

interface ConfigurationState {
    id: string; 
    key: string;
    value: string;
    originalKey: string;
    originalValue: string;
    loading: boolean;
    error: string | null;
}

class ConfigurationGrid extends Component<{}, ConfigurationState> {
    state: ConfigurationState = {
        id: "",  
        key: "",
        value: "",
        originalKey: "",
        originalValue: "",
        loading: true,
        error: null,
    };

    componentDidMount() {
        this.fetchConfiguration();
    }

    getAuthToken = () => {
        const sessionData = sessionStorage.getItem('sessionData');
        if (sessionData) {
            const parsedSession = JSON.parse(sessionData);
            return parsedSession.token;
        }
        return null;
    };

    async fetchConfiguration() {
        const token = this.getAuthToken();
        if (!token) {
            this.setState({ error: "No se encontró el token de autenticación", loading: false });
            return;
        }

        try {
            const response = await axios.get("https://localhost:7001/api/Configuration", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data.data; // La respuesta del servidor contiene el objeto con `id`, `key` y `value`
            console.log("Data from server:", data); // Verifica la respuesta

            if (data && data.key && data.value && data.id) {
                this.setState({
                    id: data.id,  // Guarda el id en el estado
                    key: data.key,
                    value: data.value,
                    originalKey: data.key,
                    originalValue: data.value,
                    loading: false,
                });
            } else {
                this.setState({ error: "Datos no válidos recibidos del servidor", loading: false });
            }
        } catch (error: any) {
            this.setState({ error: error.message, loading: false });
        }
    }



    async updateConfiguration() {
        const { key, value, id } = this.state;
        const token = this.getAuthToken();
    
        if (!token) {
            this.setState({ error: "No se encontró el token de autenticación" });
            return;
        }
    
        // Verifica si `key` y `value` son correctos antes de actualizar
        console.log("Key before update:", key);
        console.log("Value before update:", value);
        console.log("ID before update:", id);  // Verifica que el ID esté correctamente recuperado
    
        // Aquí siempre se incluirán tanto `Key`, `Value` e `id`
        const updates: any = {
            Key: key,  // Incluye el Key
            Value: value,  // Incluye el Value
            Id: id,  // Incluye el ID que se recuperó del servidor
        };
    
        // Verifica qué contiene `updates` antes de enviarlo
        console.log("Updates object:", updates);  // Verifica qué contiene el objeto antes de enviarlo
    
        try {
            const response = await axios.put(
                "https://localhost:7001/api/Configuration",
                updates, // Enviar el objeto con `Key`, `Value` y `Id`
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            this.setState({
                originalKey: key,
                originalValue: value,
                error: null,
            });
    
            // Mostrar la alerta de éxito con SweetAlert2
            Swal.fire({
                title: '¡Configuración actualizada!',
                text: 'Los cambios se han guardado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
    
        } catch (error: any) {
            this.setState({ error: error.message });
    
            // Mostrar la alerta de error con SweetAlert2
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    }
    





    handleInputChange = (field: keyof ConfigurationState, value: string) => {
        this.setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    render() {
        const { key, value, loading, error } = this.state;
    
        return (
            <div className="configuration-container">
                {loading ? (
                    <p>Cargando configuración...</p>
                ) : (
                    <div>
                        <h2>Configuraciones del Sistema</h2>
                        {error && <p className="error">{error}</p>}
                        <table>
                            <thead>
                                <tr>
                                    <th>Documentos</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Cantidad de documentos permitidos por bloque en el sistema:</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => this.handleInputChange("value", e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button onClick={() => this.updateConfiguration()}>Actualizar Configuración</button>
                    </div>
                )}
            </div>
        );
    }
    
}

export default ConfigurationGrid;
