import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  generateReport(data:any){
    return this.httpClient.post(this.url+'/factura/generateReport/',data);
  }

  getPDF(data:any):Observable<Blob>{
    return this.httpClient.post(this.url+'/factura/getPdf/',data,{responseType:'blob'});
  }

  getBills(){
    return this.httpClient.get(this.url+'/factura/getFacturas/');
  }

  delete(id:any){
    return this.httpClient.delete(this.url+'/factura/delete/'+id);
  }
}
