import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subscription, first } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as citiesJSON from '../../assets/data/cities.json';
@Component({
  selector: 'app-initial-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './initial-form.component.html',
  styleUrl: './initial-form.component.scss'
})

export class InitialFormComponent implements OnInit, OnDestroy {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  intialForm: FormGroup = new FormGroup({
    tripTypeControl: new FormControl([], Validators.required),
    departureLocation: new FormControl([], Validators.required),
    destinationLocation: new FormControl([], Validators.required),
    departureDate: new FormControl<Date | null>(null),
    dateRange: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null)
    }),
    passengerControl: new FormControl([], Validators.required)
  })

  formChanges: Subscription;

  tripOptions = [
    { description: 'One-way', value: 'one-way' },
    { description: 'Round-trip', value: 'round-trip' }
  ];

  cityOptions: Array<string> = citiesJSON.cities;
  filteredCityOptions: Array<string>;

  constructor() {
    this.formChanges = this.intialForm.valueChanges.pipe()
      .subscribe(formVal => console.log(formVal));

    this.filteredCityOptions = this.cityOptions.slice()
  }

  filter() {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredCityOptions = this.cityOptions.filter(o => o.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    console.log("KM InitialComponent cityOptions =", this.cityOptions);
  }

  ngOnDestroy(): void {
    this.formChanges.unsubscribe();
  }
}
