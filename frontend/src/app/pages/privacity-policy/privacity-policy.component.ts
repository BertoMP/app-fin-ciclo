import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-privacity-policy',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './privacity-policy.component.html',
  styleUrl: './privacity-policy.component.scss'
})
export class PrivacityPolicyComponent implements OnInit {

    constructor(private title: Title) {
    }

    ngOnInit(): void {
        this.title.setTitle('Política de privacidad');
    }
}
