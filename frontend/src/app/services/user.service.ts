import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  signup(data: any) {
    return this.httpClient.post(`${this.url}/user/signup`, data);
  }

  forgotPassword(data: any) {
    return this.httpClient.post(this.url + '/user/forgotPassword/', data);
  }

  login(data: any) {
    return this.httpClient.post(this.url + '/user/login/', data);
  }

  checkToken() {
    return this.httpClient.get(this.url + '/user/checkToken');
  }
}
