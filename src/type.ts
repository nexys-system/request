export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface Headers {
  [k: string]: string;
}

export interface Query {
  [k: string]: string;
}
