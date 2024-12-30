import axios from "axios";

axios.defaults.baseURL = "http://localhost:5277/";

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

export { login, register };