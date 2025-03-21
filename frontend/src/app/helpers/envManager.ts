// Function to get and return SDM role from evn
export const getSDMUserRole = () => {
  const roleName: string =
    import.meta.env.VITE_SDM_ROLE_NAME ||
    ((window as any)._env_ && (window as any)._env_.VITE_SDM_ROLE_NAME);
  return roleName;
};
