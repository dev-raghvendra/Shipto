import { status } from "@grpc/grpc-js";
import { GrpcAppError } from "@shipto/services-commons";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { createGithubJwt } from "libs/jwt";
import { Octokit } from "octokit";


interface GithubAxiosRequestConfig extends AxiosRequestConfig {
    installationId:string;
} 

export class GithubExternalService {

    private _octo : Octokit

    constructor(){
        this._octo = new Octokit
    }

    // private _BASE_URI:string;
    // private _axiosInstance: AxiosInstance;
    // private _accessTokenCache: Map<string, {token: string, expiresAt: number}> = new Map();
    // private _exceptionRoutes : string[]

    // constructor() {
    //     this._BASE_URI = "https://api.github.com";
    //     this._accessTokenCache = new Map();
    //     this._exceptionRoutes = [`/access_tokens`]
    //     this._axiosInstance = axios.create({
    //         baseURL: this._BASE_URI,
    //         headers:{
    //             "Content-Type":"application/vnd.github+json"
    //         }
    //     })
    //     this._axiosInstance.interceptors.request.use((config)=>{
    //         const customConfig = config as GithubAxiosRequestConfig;
    //         if(customConfig.installationId && !this._exceptionRoutes.some(route=>customConfig.url?.includes(route))){
    //             const cachedToken = this._accessTokenCache.get(customConfig.installationId);
    //             if(cachedToken && cachedToken.expiresAt > Date.now()){
    //                 config.headers["Authorization"] = `Bearer ${cachedToken.token}`;
    //             }
    //             else if (cachedToken) {
    //                 this._accessTokenCache.delete(customConfig.installationId)
    //             }
    //         }
    //         return config;
    //     })
    // }
    // private async _refreshAccessToken(installationId:string){
    //       try {
    //          const route = `/installations/${installationId}/access_tokens`;
    //          const res  = await this._axiosInstance.post(route,undefined,{
    //             installationId,
    //             headers:{
    //                 Authorization:`Bearer ${createGithubJwt()}`,
    //                 "X-GitHub-Api-Version":"2022-11-28"
    //             }
    //         } as GithubAxiosRequestConfig);
    //          res.data && this._accessTokenCache.set(installationId, {
    //             token: res.data.token,
    //             expiresAt: Date.now() + (res.data.expires_in * 1000 - 3000) 
    //         });
    //         return res.data.token;
    //       } catch (e:any) {
    //          if (e.response && e.response.status === 404){
    //             throw new GrpcAppError(status.NOT_FOUND,"User haven't connected their GitHub account yet.");
    //          }
    //          else if (e.response && e.response.status === 403) {
    //              if(e.response?.headers["x-ratelimit-remaining"]==0){
    //                 throw new GrpcAppError(status.UNAVAILABLE,"User have made too many attempts, please try after sometime")
    //              }
    //              throw new GrpcAppError(status.PERMISSION_DENIED,"User doesn't have permission to access this resource.");
    //          }
    //         throw new GrpcAppError(status.INTERNAL,"Unexpected error occured",e)
    //       }
    // }
    
    

}