import { getAxiosInstance } from "@cats/helpers/utility";

const CATS_API: string =
  import.meta.env.VITE_BACKEND_API ||
  ((window as any)._env_ && (window as any)._env_.VITE_BACKEND_API);

export const sendInvoice = async (emailPayload: any, file: File) => {
  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    
    for(const key in emailPayload) {
      formData.append(key, emailPayload[key]);
    }

    await getAxiosInstance(CATS_API).post(`/email/sendEmail`, formData)
    .then(response => {
      return response;
    })
    .catch(err => {
      return err;
    });
  } catch (error) {
    console.error('Error in sending invoice:', error);
    throw error;
  }
};
