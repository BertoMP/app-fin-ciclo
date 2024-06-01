import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private landbotInitialized = false;
  private scriptElement: HTMLScriptElement | null = null;

  constructor(private router: Router) {}

  public initLandbot(): void {
    if (!this.landbotInitialized) {
      this.scriptElement = document.createElement('script');
      this.scriptElement.type = 'text/javascript';
      this.scriptElement.async = true;
      this.scriptElement.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.js';

      this.scriptElement.onload = () => {
        this.initializeLandbot();
      };

      this.scriptElement.onerror = () => {};

      const x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(this.scriptElement, x);

      this.landbotInitialized = true;
    }
  }

  public removeChatbotIfOnMediappPage(): void {
    if (this.router.url.startsWith('/mediapp')) {
      this.removeLandbot();
    }
  }

  public removeLandbot(): void {
    if (this.scriptElement) {
      this.scriptElement=null;
      this.landbotInitialized = false;
    }

    const landbotElements = document.getElementsByClassName('LandbotLivechat');
    while (landbotElements.length > 0) {
      landbotElements[0].parentNode.parentNode.removeChild(landbotElements[0].parentNode);
    }
  }

  public isLandbotVisible(): boolean {
    const landbotElements = document.getElementsByClassName('LandbotLivechat');

    return landbotElements.length > 0;
  }

  private initializeLandbot(): void {
    if ((window as any).Landbot) {
      new (window as any).Landbot.Livechat({
        configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2238915-UHSCWASU3IQANV09/index.json'
      });
    }
  }
}
