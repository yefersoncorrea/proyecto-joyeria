import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  add(data: any) {
    return this.httpClient.post(this.url + '/producto/add/', data);
  }

  update(data: any) {
    return this.httpClient.patch(this.url + '/producto/update/', data);
  }

  getProductos() {
    return this.httpClient.get(this.url + '/producto/get/');
  }

  updateStatus(data: any) {
    return this.httpClient.patch(this.url + '/producto/updateStatus/', data);
  }

  delete(id: any) {
    return this.httpClient.delete(this.url + '/producto/delete/' + id);
  }

  getProductsByCategory(id: any) {
    return this.httpClient.get(this.url + '/producto/getByCategoria/' + id);
  }

  getById(id: any) {
    return this.httpClient.get(this.url + '/producto/getById/' + id);
  }
}
