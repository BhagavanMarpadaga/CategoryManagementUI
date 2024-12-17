import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // The sendRequest method
  sendRequest = async (
    method: string,
    params: { [key: string]: string },
    body: unknown,
    pathparam?: string
  ): Promise<unknown> => {
    try {
      let baseUrl = "https://categorylambda.netlify.app/.netlify/functions/app/api/v1/category";
      // let baseUrl =
      //   "http://localhost:9999/.netlify/functions/app/api/v1/category";

      if (pathparam) {
        baseUrl = `${baseUrl}/${pathparam}`;
      }

      // Append query parameters if provided
      if (params && Object.keys(params).length > 0) {
        const queryString = Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");
        baseUrl += `?${queryString}`;
      }

      const options: AxiosRequestConfig = {
        method: method,
        url: baseUrl,
        data: body,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, PUT, POST, DELETE, HEAD, OPTIONS",
        },
      };

      const response: AxiosResponse = await axios(options);

      if (response.status === 200) {
        return response.data.data;
      } else {
        if (response.data.error) {
          return Promise.reject(response.data.errorMessage);
        }
        return Promise.reject(response.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("Error", err);
      return Promise.reject(err?.response?.data || "Something went wrong");
    }
  };
}

// Export a single instance of ApiClient
export const apiClient = ApiClient.getInstance();
