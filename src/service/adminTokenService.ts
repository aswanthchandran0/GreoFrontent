export const adminTokenService = {
    setToken:(accessToken:string)=>{
        localStorage.setItem('adminAcessToken',accessToken)

    },
    getAccessToken:()=>{
     const accessToken =   localStorage.getItem('adminAcessToken')
               return accessToken
    },
    clearToken:()=> localStorage.removeItem('adminAcessToken')
}