import { AxiosResponse } from "axios";
import { api } from "..";

const login = async (email: string, password: string): Promise<AxiosResponse> => {
    const result = await api.post("/administradores/login", {
        email,
        senha: password
    });

    return result;
};

const register = async (email: string, password: string, role: string): Promise<AxiosResponse> => {
    const result = await api.post("/administradores", {
        email,
        senha: password,
        perfil: role
    });

    return result;
};

export { login, register };