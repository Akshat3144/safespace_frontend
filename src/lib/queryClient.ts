import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

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

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }

  return response.json();
};
