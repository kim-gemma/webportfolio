export interface ContactPayload {
  name: string;
  email?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  error?: string;
}
