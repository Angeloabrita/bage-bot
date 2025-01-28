import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


interface Message {
  text: string
  author: 'user' | 'gemini'
}


@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.api_endpoint;
  }

  generateContent(message: string, historicalMessage?: Message[]): Observable<any> {
    console.log("API:  Executando o Post da Mensagem");
    console.log({ message, historicalMessages: historicalMessage });


    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');

    return this.http.post<any>(this.apiUrl,
      { message, historicalMessages: historicalMessage }, { headers }) // correçao

  }
}