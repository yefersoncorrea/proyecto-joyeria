import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  add(data:any){
    return this.httpClient.post(this.url +'/categoria/add/',data);
  }

  update(data:any){
    return this.httpClient.patch(this.url +'/categoria/update/',data);
  }

  getCategorys(){
    return this.httpClient.get(this.url+"/categoria/get/");
  }
}
