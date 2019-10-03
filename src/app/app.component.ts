import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpQueueService } from './http-queue.service';

interface CepResponse {
  bairro: string;
  cep: string;
  complemento: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  uf: string;
  unidade: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'http-queue';

  constructor(private readonly http: HttpClient, readonly httpQueue: HttpQueueService) { }

  ngOnInit(): void {
    for (let i = 0; i < 20; i++) {
      console.log(`Enqueue i=${i}.`);
      const req = this.http.get<CepResponse>('https://viacep.com.br/ws/01001000/json/');
      const subscription = this.httpQueue.invoke(req).subscribe(
        data => {
          console.log(`Result of i=${i}. CEP = "${data.cep}"`);
          subscription.unsubscribe();
        }
      );
    }
  }

}
