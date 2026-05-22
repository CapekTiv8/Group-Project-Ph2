const baseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://group-project-ph2-production.up.railway.app'
    : 'http://localhost:3012');

export default baseUrl;
