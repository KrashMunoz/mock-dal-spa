import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, Subscription, debounceTime, distinctUntilChanged, first, map, startWith, tap } from 'rxjs';
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
    AsyncPipe
  ],
  templateUrl: './initial-form.component.html',
  styleUrl: './initial-form.component.scss'
})

export class InitialFormComponent implements OnInit, OnDestroy {
  // formChanges: Subscription;

  intialForm: FormGroup = new FormGroup({
    tripTypeControl: new FormControl([], Validators.required),
    departureLocation: new FormControl<string>('', Validators.required),
    destinationLocation: new FormControl([], Validators.required),
    departureDate: new FormControl<Date | null>(null),
    dateRange: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null)
    }),
    passengerControl: new FormControl([], [Validators.required, Validators.min(1), Validators.max(9)])
  })

  tripOptions = [
    { description: 'One-way', value: 'one-way' },
    { description: 'Round-trip', value: 'round-trip' }
  ];

  cityOptions: string[] = citiesJSON.cities;
  filteredDepartureCities: Observable<string[]> | undefined;
  filteredDestinationCities: Observable<string[]> | undefined;

  constructor() {
    // this.formChanges = this.intialForm.valueChanges.pipe()
    //   .subscribe(formVal => console.log(formVal));
  }

  private _filter(value: string): string[] {
    const filterValue = value?.toLowerCase();
    return this.cityOptions.filter(option => option?.toLowerCase().includes(filterValue))
  }

  ngOnInit(): void {
    this.filteredDepartureCities = this.intialForm.get('departureLocation')?.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      map(value => this._filter(value))
    )
    this.filteredDestinationCities = this.intialForm.get('destinationLocation')?.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      map(value => this._filter(value))
    )
  }

  ngOnDestroy(): void {
    // this.formChanges.unsubscribe();
  }
}
