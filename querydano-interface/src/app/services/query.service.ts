import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type Tip = {
  block: number,
  epoch: number,
  era: string,
  hash: string,
  slot: number,
  syncProgress: string
}

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private http: HttpClient) { }

  tip(): Observable<Tip> {
    return this.http.get<Tip>(`http://127.0.0.1:5796/tip`);
  }
}
