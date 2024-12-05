import api from "./BaseService"

export interface Client {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    address: string;
    phone: string;
}

export const listClientsCustom = async (query: string) => {
    return (await api.get(`/clients/?${query}`)).data;
}

export const createClient = async (element: Client) => {
    const response = await api.post('/clients/', element)
    return response
}

