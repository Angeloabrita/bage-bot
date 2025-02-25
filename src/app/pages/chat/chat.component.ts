import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeminiService } from '../../../services/gemini.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownPipe } from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MarkdownPipe

  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageControl = new FormControl('');
  messages: { text: string, author: 'user' | 'gemini' }[] = [];
  loading: boolean = false;
  geminiMessageSub: Subscription | undefined

  constructor(private geminiService: GeminiService) { }

  ngOnInit(): void {
  }

  sendMessage(): void {
    const messageText = this.messageControl.value?.trim();

    if (messageText) {
      this.messages.push({ text: messageText, author: 'user' });
      this.loading = true;

      this.geminiMessageSub = this.geminiService.generateContent(messageText, this.messages)
        .subscribe({
          next: async (result: any) => { // Adicione async aqui se necessário
            // Garanta que result.text é uma string
            const geminiText = typeof result.text === 'string'
              ? result.text
              : await result.text; // Se for uma Promise, resolva-a

            this.messages.push({ text: geminiText, author: 'gemini' });
            this.loading = false;
          },
          error: (err) => {

            const rand_error_msg = ["Vish! Não estou conseguindo me conectar com meu cérebro. Vou mandar o pangaré que me criou resolver isso.",
              "Bha Guri! Deu ruim aqui. Vou chamar o Bagé para resolver isso.",
              "Deu merda aqui, aposto que a culpa é do Bagé.",
              "Parece que o Bagé fez cagada de novo. A API não está respondendo.",
            ]

            const rand = Math.floor(Math.random() * rand_error_msg.length);
            this.messages.push({ text: rand_error_msg[rand], author: 'gemini' });
            console.error("Erro no serviço Gemini:", err);
            this.loading = false;
          }

        });
    }

    this.messageControl.setValue('');
  }

  ngOnDestroy(): void {
    this.geminiMessageSub?.unsubscribe();
  }
}