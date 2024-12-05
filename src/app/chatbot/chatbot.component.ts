// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-chatbot',
//   standalone: true,
//   imports: [],
//   templateUrl: './chatbot.component.html',
//   styleUrl: './chatbot.component.css'
// })
// export class ChatbotComponent {

// }

declare var window: any;

// Declare SpeechRecognition types
type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

// import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})

export class ChatbotComponent {
  userInput: string = '';
  messages: { text: string; isUser: boolean }[] = [];
  recognition: any; // Use 'any' to avoid strict type errors
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    // Check if the current platform is a browser
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // Initialize SpeechRecognition only in the browser
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          this.userInput = transcript;
          this.sendMessage();
        };

        this.recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
      } else {
        console.warn('SpeechRecognition API is not supported in this browser.');
      }
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({ text: this.userInput, isUser: true });

    // Mock chatbot response
    const botResponse = this.getBotResponse(this.userInput);
    this.messages.push({ text: botResponse, isUser: false });

    // Speak the bot response
    if (this.isBrowser) {
      this.speak(botResponse);
    }

    // Clear user input
    this.userInput = '';
  }

  getBotResponse(query: string): string {
    // if (query.toLowerCase().includes('hello')) {
    //   return 'Hello! How can I assist you today?';
    // } else if (query.toLowerCase().includes('bye')) {
    //   return 'Goodbye! Have a great day!';
    // } else {
    //   return 'I am not sure about that. Can you rephrase?';
    // }
    const keywords: string[] = ["hello", "bye", "water", "air", "fire", "default"];
    const response: string[] = [
      `Hello! How can I assist you today? 
      1.water
      2.air
      3.fire`,
      "Goodbye! Have a great day!",
      "Water is an inorganic compound with the chemical formula H2O. It is a transparent, tasteless, odorless, and nearly colorless chemical substance.",
      "Air is the invisible mixture of gases that surrounds Earth. Air contains important substances, such as oxygen and nitrogen.",
      "Fire is a chemical reaction that occurs when a fuel is rapidly oxidized in the presence of oxygen, releasing heat and light.",
      "I am not sure about that. Can you rephrase?"
    ]

    let i = 0;
    let st:string = query.toLowerCase();
    for(i = 0; i<5; i++){
      if(st.includes(keywords[i])){
        return response[i];
      }
    }
    return response[i];
  }

  startVoiceRecognition() {
    if (this.isBrowser && this.recognition) {
      this.recognition.start();
    } else {
      alert('Speech recognition is not supported in this environment.');
    }
  }

  speak(text: string) {
    if (!this.isBrowser) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
  }
}