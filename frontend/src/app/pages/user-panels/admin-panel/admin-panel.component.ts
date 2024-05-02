import { Component, OnInit } from '@angular/core';
import { AdminPanelService } from '../../../core/services/admin-panel.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit{
  constructor(private adminPanelService: AdminPanelService) { }

  ngOnInit(): void {
  }
}


