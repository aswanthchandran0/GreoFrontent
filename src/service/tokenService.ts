export const tokenService = {
    setTokens:(accessToken:string,refreshToken:string)=>{
        localStorage.setItem('accessToken',accessToken)
        localStorage.setItem('refreshToken',refreshToken)
    },
   getAccessToken:()=>localStorage.getItem('accessToken'),
   getRefreshToken:()=>localStorage.getItem('refreshToken'),
   clearTokens:()=>{
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
   }

}