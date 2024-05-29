import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private landbotInitialized = false;
  private scriptElement: HTMLScriptElement | null = null;

  constructor() {}

  public initLandbot(): void {
    if (!this.landbotInitialized) {
      this.scriptElement = document.createElement('script');
      this.scriptElement.type = 'text/javascript';
      this.scriptElement.async = true;
      this.scriptElement.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.js';

      this.scriptElement.onload = () => {
        this.initializeLandbot();
      };

      this.scriptElement.onerror = () => {
        console.error('Failed to load Landbot script.');
      };

      const x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(this.scriptElement, x);

      this.landbotInitialized = true;
    } else {
      console.log('Landbot already initialized.');
    }
  }

  public removeLandbot(): void {
    if (this.scriptElement) {
      this.scriptElement=null;
      this.landbotInitialized = false;
      console.log('Landbot script removed.');
    }
  }

  private initializeLandbot(): void {
    if ((window as any).Landbot) {
      new (window as any).Landbot.Livechat({
        configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2238915-UHSCWASU3IQANV09/index.json'
      });
      console.log('Landbot initialized successfully on ' + new Date().toLocaleString());
    } else {
      console.error('Landbot script not loaded properly');
    }
  }
}
