import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeminiService } from '../../../services/gemini.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
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

    console.log("Component: Enviando mensagem para o servico Gemini")
    if (messageText) {
      this.messages.push({ text: messageText, author: 'user' });

      this.loading = true;
      this.geminiMessageSub = this.geminiService.generateContent(messageText, this.messages)
       .subscribe({
          next: (result: any) => {
            console.log("Resposta do Gemini Service:", result);
            this.messages.push({ text: result.text, author: 'gemini' });
            this.loading = false;
          },
          error: (err) => {
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