


// Function to get and return SDM role from evn
export const getSDMUserRole = () => {
    const roleName:string = process.env.REACT_APP_SDM_ROLE_NAME|| ((window as any)._env_ && (window as any)._env_.REACT_APP_SDM_ROLE_NAME) 
    return roleName;
}