import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent implements OnInit {
  constructor(private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Términos y condiciones');
  }
}
