import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

// Add API base URL constant
const API_BASE_URL = "https://safespace-api-6wr5.onrender.com"; // Replace with your actual Render API URL

export const apiRequest = async (
  method: string,
  url: string,
  payload?: any
): Promise<any> => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  // Prepend API base URL to the request URL
  const fullUrl = `${API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }

  return response.json();
};
