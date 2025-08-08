import { status } from "@grpc/grpc-js";
import { GrpcAppError } from "@shipto/services-commons";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { createGithubJwt } from "libs/jwt";


interface GithubAxiosRequestConfig extends AxiosRequestConfig {
    installationId:string;
} 

export interface GitHubRepository {
  id: number; 
  name: string; 
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    type: "User" | "Organization";
  };
  html_url: string;
  default_branch: string;
  archived: boolean;
  disabled: boolean; 
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  installation?: {
    id: number; 
  };
}

export class GithubExternalService {
    private _BASE_URI:string;
    private _axiosInstance: AxiosInstance;
    private _accessTokenCache: Map<string, {token: string, expiresAt: number}> = new Map();
    private _exceptionRoutes : string[]

    constructor() {
        this._BASE_URI = "https://api.github.com";
        this._accessTokenCache = new Map();
        this._exceptionRoutes = [`/access_tokens`]
        this._axiosInstance = axios.create({
            baseURL: this._BASE_URI,
            headers:{
                "Content-Type":"application/vnd.github+json"
            }
        })
        this._axiosInstance.interceptors.request.use(async(config)=>{
            const customConfig = config as GithubAxiosRequestConfig;
            if(customConfig.installationId && !this._exceptionRoutes.some(route=>customConfig.url?.includes(route))){
                const cachedToken = this._accessTokenCache.get(customConfig.installationId);
                if(cachedToken && cachedToken.expiresAt > Date.now()){
                    config.headers["Authorization"] = `Bearer ${cachedToken.token}`;
                }
                else{
                    if(cachedToken) this._accessTokenCache.delete(customConfig.installationId)
                    await this._refreshAccessToken(customConfig.installationId)
                    const newToken = this._accessTokenCache.get(customConfig.installationId);
                    config.headers["Authorization"] = `Bearer ${newToken?.token}`;
                }
            }
            return config;
        })
    }

    private async _refreshAccessToken(installationId:string){
          try {
             const route = `/installations/${installationId}/access_tokens`;
             const res  = await this._axiosInstance.post(route,undefined,{
                installationId,
                headers:{
                    Authorization:`Bearer ${createGithubJwt()}`,
                    "X-GitHub-Api-Version":"2022-11-28"
                }
            } as GithubAxiosRequestConfig);
             res.data && this._accessTokenCache.set(installationId, {
                token: res.data.token,
                expiresAt: Date.now() + (res.data.expires_in * 1000 - 3000) 
            });
            return res.data.token;
          } catch (e:any) {
            if(e.response?.headers["x-ratelimit-remaining"]==0){
                throw new GrpcAppError(status.UNAVAILABLE,"User have made too many attempts, please try after sometime")
            }
            else if (e.response && e.response.status === 404){
                throw new GrpcAppError(status.NOT_FOUND,"User haven't connected their GitHub account yet.");
             }
            else if (e.response && e.response.status === 403) {
                 throw new GrpcAppError(status.PERMISSION_DENIED,"User doesn't have permission to access this resource.");
             }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occured",e)
          }
    }
    
    async  getUserRepositories(installationId:string): Promise<GitHubRepository[]> {
        try {
            const route = `/installations/${installationId}/repositories`;
            const res = await this._axiosInstance.get(route,{
                headers:{
                    "X-GitHub-Api-Version":"2022-11-28"
                },
                installationId
            } as GithubAxiosRequestConfig);
            return res.data;
        } catch (e:any) {
            if(e instanceof AxiosError){
                if(e.response?.headers["x-ratelimit-remaining"]==0){
                    throw new GrpcAppError(status.UNAVAILABLE,"User have made too many attempts, please try after sometime");
                }
                else if (e.response && e.response.status === 404){
                    throw new GrpcAppError(status.NOT_FOUND,"User doesn't have any repositories or haven't granted access");
                }
                else if (e.response && e.response.status === 403) {
                    throw new GrpcAppError(status.PERMISSION_DENIED,"User doesn't have permission to access this resource.");
                }
            }
            else if(e instanceof GrpcAppError) {
                throw e;
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occured",e);
        }
    } 

    async getRepositoryDetails(installationId:string, repoId:string):Promise<GitHubRepository> {
        try {
            const route = `/repositories/${repoId}`;
            const res = await this._axiosInstance.get(route,{
                headers:{
                    "X-GitHub-Api-Version":"2022-11-28"
                },
                installationId
            } as GithubAxiosRequestConfig);
            return res.data;
        } catch (e:any) {
            if (e instanceof GrpcAppError) {
                throw e;
            }
            else if (e.response && e.response.status === 404) {
                throw new GrpcAppError(status.NOT_FOUND,"Repository not found or user doesn't have access to it.");
            }
            else if (e.response && e.response.status === 403) {
                throw new GrpcAppError(status.PERMISSION_DENIED,"User doesn't have permission to access this resource.");
            }
            else if(e.response?.headers["x-ratelimit-remaining"]==0){
                throw new GrpcAppError(status.UNAVAILABLE,"User have made too many attempts, please try after sometime");
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occured",e);
        }
    }
}


const githubExternalService = new GithubExternalService();
export default githubExternalService;