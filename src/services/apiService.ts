import axios, { AxiosError } from 'axios';

// Acesse a variável de ambiente usando import.meta.env para Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Interfaces para os dados (espelhando o que o backend espera/retorna) ---

// Dados para criar uma conta
export interface CreateAccountPayload {
    email: string;
    senha: string;
    nome: string;
    matricula: string;
    ano_ingresso: number;
    id_curso: number;
}

export interface CreatedUserResponse {
    matricula: string;
    email: string;
    nome: string;
    ano_ingresso: number;
    id_curso: number;
}

export interface CursosResponse {
    nome: string;
    id_curso: number;
}

export interface CreateComputerPayload {
    marca?: string;
    modelo?: string;
    ano?: number;
    ram?: string;
    tipo_hd?: string;
    armazenamento?: string;
    processador?: string;
    detalhes?: string;
    id_usuario?: string;
}

export interface ComputerResponse {
    marca?: string;
    modelo?: string;
    ano?: number;
    ram?: string;
    tipo_hd?: string;
    armazenamento?: string;
    processador?: string;
    detalhes?: string;
    id_usuario?: string;
}

export interface PontoColetaResponse {
    id: number;
    nome: string;
    instituto?: string;
    email?: string;
    telefone?: string;
}

// Dados para login
export interface LoginPayload {
    email: string;
    senha: string;
}

// Dados do usuário retornados no login/get user
export interface UserProfile {
    matricula: string;
    email: string;
    nome: string;
    ano_ingresso: number;
    id_curso: number;
}

// Resposta da API de login
export interface LoginResponse {
    token: string;
    user: UserProfile;
}


// Dados para criar um pedido na fila de espera
export interface CreatePedidoPayload {
    justificativa?: string;
    id_usuario: string; // Matrícula do usuário
}

// Resposta da API ao criar ou buscar um pedido (espelha IPedidoSemRelacionamentos)
export interface PedidoResponse {
    id: number;
    id_computador: number | null;
    id_ponto_entrega: number | null;
    id_usuario: string | null;
    justificativa: string | null;
    status: boolean | null;
    prioridade: number | null;
}

// Interface para erros da API (se sua API tiver um formato padrão de erro)
export interface ApiErrorResponse {
    message: string;
    // statusCode?: number;
    // errors?: Record<string, string[]>; // Para erros de validação de campos
}


// --- Funções da API ---

/**
 * Função para criar uma nova conta de usuário.
 */
export const criarContaApi = async (userData: CreateAccountPayload): Promise<CreatedUserResponse> => {
    try {
        const response = await apiClient.post<CreatedUserResponse>('/api/v1/users', userData);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error(axiosError.message || 'Erro desconhecido ao criar conta');
        }
    }
};

export const criarComputador = async (computerData: CreateComputerPayload, authToken: string): Promise<ComputerResponse> => {
    try {
        console.log('Dados do computador:', computerData); // Log para depuração
        console.log('authToken:', authToken); // Log para depuração
        const response = await apiClient.post('/api/v1/computers', computerData, {
            headers: { Authorization: authToken }
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error(axiosError.message || 'Erro desconhecido ao criar Computador');
        }
    }
};

export const criarPedido = async (pedidoData: CreatePedidoPayload, authToken: string): Promise<PedidoResponse> => {
    try {
        const response = await apiClient.post<PedidoResponse>('/api/v1/pedidos', pedidoData, {
            headers: { Authorization: authToken },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error(axiosError.message || 'Erro desconhecido ao criar pedido');
        }
    }
};

export const getCursos = async (): Promise<CursosResponse> => {
    try {
        const response = await apiClient.get<CursosResponse>('/api/v1/cursos');
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error(axiosError.message || 'Erro desconhecido ao carregar cursos');
        }
    }
};

export const getComputadores = async (id_usuario: string, authToken: string): Promise<ComputerResponse[]> => {
    try {
        const response = await apiClient.get<ComputerResponse[]>(`/api/v1/computers?id_usuario=${id_usuario}`,
            {
            headers: { Authorization: authToken }
        }
        );
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error(axiosError.message || 'Erro desconhecido ao carregar computadores');
        }
    }
};

export const getMeusPedidos = async (matricula: string, authToken: string): Promise<PedidoResponse[]> => {
    try {
        const response = await apiClient.get('/api/v1/pedidos', {
            headers: { Authorization: authToken },
            params: { id_usuario: matricula },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error(axiosError.message || 'Erro desconhecido ao buscar pedidos');
        }
    }
};

export const getPontoColetaById = async (id: number, authToken: string): Promise<PontoColetaResponse> => {
    try {
        const response = await apiClient.get<PontoColetaResponse>(`/api/v1/pontos-coleta/${id}`, {
            headers: { Authorization: authToken },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error(axiosError.message || 'Erro desconhecido ao buscar o ponto de coleta');
        }
    }
};

export const getComputadorById = async (id: number, authToken: string): Promise<ComputerResponse> => {
    try {
        const response = await apiClient.get<ComputerResponse>(`/api/v1/computers/${id}`, {
            headers: { Authorization: authToken },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error(axiosError.message || 'Erro desconhecido ao buscar o computador');
        }
    }
};

/**
 * Função para realizar login.
 */
export const loginApi = async (credentials: LoginPayload): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>('/api/v1/users/login', credentials);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error(axiosError.message || 'Erro desconhecido ao tentar fazer login');
        }
    }
};