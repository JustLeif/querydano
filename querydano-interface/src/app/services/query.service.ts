import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tip, Tx } from '../data/json.data';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private http: HttpClient) { }

  tip(): Observable<Tip> {
    return this.http.get<Tip>(`http://127.0.0.1:5796/tip`);
  }

  utxo(address: string): Observable<Tx[]> {
    return this.http.get<Tx[]>(`http://127.0.0.1:5796/utxo/${address}`)
  }
}
