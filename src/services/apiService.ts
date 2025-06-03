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