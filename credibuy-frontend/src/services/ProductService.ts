import api from "./BaseService"

export const listProducts = async () => {
    const response = await api.get('/product/')
    return response;
}

export const listProductsCustom = async (config: string) => {
    const response = await api.get(`/product/?${config}`)
    return response.data;
}