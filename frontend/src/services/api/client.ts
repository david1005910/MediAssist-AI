import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  SymptomAnalysisRequest,
  SymptomAnalysisResponse,
  SymptomNERRequest,
  SymptomNERResponse,
  ImageAnalysisResponse,
  GradCAMResponse,
  LiteratureSearchRequest,
  LiteratureSearchResponse,
  RAGQueryRequest,
  RAGQueryResponse,
  AcademicSource,
  AcademicSearchRequest,
  AcademicSearchResponse,
} from '@/types'

// Use empty string to go through Vite proxy, or direct URL for production
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Health Check
  async healthCheck() {
    const response = await this.client.get('/health')
    return response.data
  }

  // ==================== Authentication ====================

  async login(email: string, password: string) {
    const response = await this.client.post('/api/v1/auth/login', { email, password })
    return response.data
  }

  async register(data: { email: string; password: string; name: string; role?: string }) {
    const response = await this.client.post('/api/v1/auth/register', data)
    return response.data
  }

  async logout() {
    const response = await this.client.post('/api/v1/auth/logout')
    return response.data
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/v1/auth/me')
    return response.data
  }

  // ==================== Symptom Analysis ====================

  async analyzeSymptoms(data: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
    const response = await this.client.post('/api/v1/symptom/analyze', data)
    return response.data
  }

  async extractSymptoms(data: SymptomNERRequest): Promise<SymptomNERResponse> {
    const response = await this.client.post('/api/v1/symptom/extract', data)
    return response.data
  }

  async getAvailableDiseases() {
    const response = await this.client.get('/api/v1/symptom/diseases')
    return response.data
  }

  async getAvailableSymptoms() {
    const response = await this.client.get('/api/v1/symptom/symptoms')
    return response.data
  }

  // ==================== Image Analysis ====================

  async analyzeImage(file: File): Promise<ImageAnalysisResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post('/api/v1/image/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes timeout for model inference
    })
    return response.data
  }

  async generateGradCAM(file: File, targetCondition?: string): Promise<GradCAMResponse> {
    const formData = new FormData()
    formData.append('file', file)

    let url = '/api/v1/image/gradcam'
    if (targetCondition) {
      url += `?target_condition=${encodeURIComponent(targetCondition)}`
    }

    const response = await this.client.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes timeout for Grad-CAM generation
    })
    return response.data
  }

  async getImageConditions() {
    const response = await this.client.get('/api/v1/image/conditions')
    return response.data
  }

  // ==================== RAG Literature Search ====================

  async searchLiterature(data: LiteratureSearchRequest): Promise<LiteratureSearchResponse> {
    const response = await this.client.post('/api/v1/rag/search', data)
    return response.data
  }

  async queryRAG(data: RAGQueryRequest): Promise<RAGQueryResponse> {
    const response = await this.client.post('/api/v1/rag/query', data)
    return response.data
  }

  async getRAGStats() {
    const response = await this.client.get('/api/v1/rag/stats')
    return response.data
  }

  async loadSampleData() {
    const response = await this.client.post('/api/v1/rag/load-sample-data')
    return response.data
  }

  // ==================== Academic Search ====================

  async getAcademicSources(): Promise<{ sources: AcademicSource[] }> {
    const response = await this.client.get('/api/v1/rag/academic/sources')
    return response.data
  }

  async searchAcademic(data: AcademicSearchRequest): Promise<AcademicSearchResponse> {
    const response = await this.client.post('/api/v1/rag/academic/search', data, {
      timeout: 60000, // 1 minute timeout for multi-source search
    })
    return response.data
  }

  async searchPubMed(query: string, maxResults: number = 10, ingest: boolean = false) {
    const response = await this.client.post('/api/v1/rag/academic/pubmed', {
      query,
      max_results: maxResults,
      ingest,
    }, {
      timeout: 60000,
    })
    return response.data
  }
}

export const apiClient = new ApiClient()
