import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Override to add JWT Authorization header
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let text = res.statusText;
    try {
      // Try to parse as JSON first
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        text = data.message || data.error || text;
      } else {
        // If not JSON, get the text (could be HTML error page)
        const textResponse = await res.text();
        // Check if it looks like an HTML error page
        if (textResponse.includes("<!DOCTYPE") || textResponse.includes("<html")) {
          console.error("Server returned HTML error page:", textResponse.substring(0, 200));
          text = "Server error: " + res.status + " " + res.statusText;
        } else {
          text = textResponse || text;
        }
      }
    } catch {
      text = (await res.text()) || text;
    }
    throw new Error(text);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const apiBase = import.meta.env.VITE_API_URL || '';
  const fullUrl = apiBase + url;
  
  const token = localStorage.getItem("kiwiqa_token");
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}


type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const apiBase = import.meta.env.VITE_API_URL || '';
    const fullUrl = apiBase + (queryKey[0] as string);
    
    const token = localStorage.getItem("kiwiqa_token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(fullUrl, { headers });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
