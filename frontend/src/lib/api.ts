import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Fixture {
  id: string;
  name: string;
  slug: string;
  manufacturer: {
    id: string;
    name: string;
    slug: string;
  };
  fixture_type: {
    id: string;
    name: string;
    slug: string;
  };
  weight_kg?: number;
  power_consumption_watts?: number;
  light_source_type?: string;
  primary_image_url?: string;
  color_mixing_type?: string;
  gobo_wheels_count?: number;
  prism?: boolean;
  iris?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FixtureFilters {
  manufacturer_id?: string;
  fixture_type_id?: string;
  light_source_type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// API Functions
export const fixturesApi = {
  getAll: async (filters?: FixtureFilters) => {
    const response = await api.get<PaginatedResponse<Fixture>>('/fixtures', { params: filters });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<Fixture>(`/fixtures/${id}`);
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get<Fixture>(`/fixtures/slug/${slug}`);
    return response.data;
  },
};

export const manufacturersApi = {
  getAll: async () => {
    const response = await api.get('/manufacturers');
    return response.data;
  },
};

export const vendorsApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/vendors', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/vendors/slug/${slug}`);
    return response.data;
  },

  getAllLocations: async () => {
    const response = await api.get('/vendors/locations');
    return response.data;
  },
};

export const searchApi = {
  search: async (query: string, limit?: number) => {
    const response = await api.get('/search', { params: { q: query, limit } });
    return response.data;
  },
};
