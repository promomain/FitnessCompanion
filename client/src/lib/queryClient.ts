import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(path, options);
  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => ({ queryKey }: { queryKey: string[] }) => Promise<T | null> = <T>(
  options: { on401: UnauthorizedBehavior }
) => {
  return async ({ queryKey }: { queryKey: string[] }): Promise<T | null> => {
    const [path, ...params] = queryKey;

    try {
      const res = await fetch(path, {
        credentials: "include",
      });

      if (res.status === 401 && options.on401 === "returnNull") {
        return null;
      }

      await throwIfResNotOk(res);
      return res.json();
    } catch (e) {
      console.error("Failed to fetch", e);
      throw e;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});