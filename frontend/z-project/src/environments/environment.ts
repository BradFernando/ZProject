export const environment = {
  production: true,
  apiUrl: (globalThis as any)['env']?.['apiUrl'] || 'http://localhost:8080/api'
};
