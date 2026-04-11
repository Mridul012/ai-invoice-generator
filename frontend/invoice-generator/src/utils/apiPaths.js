const BASE_URL = "https://ai-invoice-generator-yfkh.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GET_ME: `${BASE_URL}/api/auth/me`,
    UPDATE_PROFILE: `${BASE_URL}/api/auth/me`,
  },

  INVOICES: {
    CREATE: `${BASE_URL}/api/invoices`,
    GET_ALL: `${BASE_URL}/api/invoices`,
    GET_BY_ID: (id) => `${BASE_URL}/api/invoices/${id}`,
    UPDATE: (id) => `${BASE_URL}/api/invoices/${id}`,
    DELETE: (id) => `${BASE_URL}/api/invoices/${id}`,
  },

  AI: {
    PARSE_TEXT: `${BASE_URL}/api/ai/parse-text`,
    GENERATE_REMINDER: `${BASE_URL}/api/ai/generate-remainder`,
    DASHBOARD_SUMMARY: `${BASE_URL}/api/ai/dashboard-summary`,
  },
};
