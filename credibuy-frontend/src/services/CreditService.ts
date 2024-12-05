import api from "./BaseService";

export interface Credit {
    id: number;
    client: number;
    client_name: string;
    product: number;
    product_name: string;
    created_at: Date;
    status: "active" | "completed";
    debt: number;
    total_payments: 12
}

export interface FullCredit extends Credit {
    payments: Payment[]
}


export interface CreditResponse<T> {
    count: number;
    results: T[];
}

export interface Payment {
    id: number;
    value: number;
    due_to: Date;
    value_delayed: number;
    paid: boolean;
    status: "pending" | "completed" | "delayed";
}

export const listCredits = async (query: string): Promise<CreditResponse<Credit>> => {
    const response = await api.get(`/credit/?${query}`);
    const data: Credit[] = [];
    
    for (const cred of response.data.results) {
        data.push({
            client: cred.client,
            client_name: cred.client_name,
            created_at: new Date(cred.created_at),
            debt: parseFloat(cred.debt),
            id: cred.id,
            product: cred.product,
            product_name: cred.product_name,
            status: cred.status,
            total_payments: cred.total_payments
        })
    }
    
    return {
        count: response.data.count,
        results: data
    }
}

export const detailCredit = async (id: number): Promise<FullCredit> => {
    const response = await api.get(`/credit/${id}`);
    const cred = response.data;
    const paymResponse = await api.get(`/payments/by-credit/${id}`);
    const payms = paymResponse.data;

    const payments: Payment[] = [];

    for (const paym of payms) {
        payments.push({
            due_to: new Date(paym.due_to),
            id: paym.id,
            status: paym.status,
            value: parseFloat(paym.value),
            value_delayed: parseFloat(paym.value_delayed),
            paid: paym.paid
        })
    }

    const data: FullCredit = {
        client: cred.client,
        client_name: cred.client_name,
        created_at: new Date(cred.created_at),
        debt: parseFloat(cred.debt),
        id: cred.id,
        product: cred.product,
        product_name: cred.product_name,
        status: cred.status,
        total_payments: cred.total_payments,
        payments: payments
    }

    return data;
}

export const markPaymentAs = async (id: number, paid: boolean) => {
    const response = await api.patch(`/payments/${id}/`, {
        paid
    })
    return response
}

export const createCredit = async (clientId: number, productId: number, payments: number) => {
    const response = await api.post(`/credits/create/`, {
        client: clientId,
        product: productId,
        total_payments: payments
    })
    console.log(response);
    return response
}