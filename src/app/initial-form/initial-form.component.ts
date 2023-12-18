import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-initial-form',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './initial-form.component.html',
  styleUrl: './initial-form.component.scss'
})
export class InitialFormComponent {

}
