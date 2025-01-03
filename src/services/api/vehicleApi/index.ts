import axios from "axios";
import { VehicleType } from "./types";

axios.defaults.baseURL = "http://localhost:5277/";


// administrator
const login = async (email: string, password: string) => {
    const result = await axios.post("/administradores/login", {
        email,
        senha: password
    });

    return result;
};

const register = async (email: string, password: string, role: string) => {
    const result = await axios.post("/administradores", {
        email,
        senha: password,
        perfil: role
    });

    return result;
};


// Vehicles
const getAllVehicles = async (token: string): Promise<VehicleType[]> => {
    const result = await axios.get("/veiculo", {
        headers: {"Authorization": `Bearer ${token}`}
    });

    return result.data;
}

const deleteVehicle = async (token: string, id: number) => {
    const result = await axios.delete(`/veiculo/${id}`, {
        headers: {"Authorization": `Bearer ${token}`}
    });

    return result;
}

const createVehicle = async (token: string, name: string, mark: string, year: number) => {
    const result = await axios.post("/veiculo", {
        marca: mark,
        ano: year,
        nome: name
    }, {
        headers: {"Authorization": `Bearer ${token}`}
    });
    return result;
} 

const editVehicle = async (token: string, id: number, name: string, mark: string, year: number) => {
    const result = await axios.patch(`/veiculo/${id}`, {
        marca: mark,
        ano: year,
        nome: name
    }, {
        headers: {"Authorization": `Bearer ${token}`}
    });
    return result;
} 

export { login, register, getAllVehicles, deleteVehicle, createVehicle, editVehicle };