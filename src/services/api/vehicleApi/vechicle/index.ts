import { api } from "..";
import { VehicleType } from "./types";
import { AxiosResponse } from "axios";

const getAllVehicles = async (token: string): Promise<VehicleType[]> => {
    const result = await api.get("/veiculo", {
        headers: {"Authorization": `Bearer ${token}`}
    });

    return result.data;
}

const deleteVehicle = async (token: string, id: number): Promise<AxiosResponse> => {
    const result = await api.delete(`/veiculo/${id}`, {
        headers: {"Authorization": `Bearer ${token}`}
    });

    return result;
}

const createVehicle = async (token: string, name: string, mark: string, year: number): Promise<AxiosResponse> => {
    const result = await api.post("/veiculo", {
        marca: mark,
        ano: year,
        nome: name
    }, {
        headers: {"Authorization": `Bearer ${token}`}
    });
    return result;
} 

const editVehicle = async (token: string, id: number, name: string, mark: string, year: number): Promise<AxiosResponse> => {
    const result = await api.patch(`/veiculo/${id}`, {
        marca: mark,
        ano: year,
        nome: name
    }, {
        headers: {"Authorization": `Bearer ${token}`}
    });
    return result;
} 

export { getAllVehicles, deleteVehicle, createVehicle, editVehicle };