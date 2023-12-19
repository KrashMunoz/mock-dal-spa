import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, Subscription, debounceTime, distinctUntilChanged, first, map, range, startWith, tap } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as citiesJSON from '../../assets/data/cities.json';
import { MatButtonModule } from '@angular/material/button';
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
    MatButtonModule,
    AsyncPipe
  ],
  templateUrl: './initial-form.component.html',
  styleUrl: './initial-form.component.scss'
})

export class InitialFormComponent implements OnInit, OnDestroy {
  subscriptions: Array<Subscription | undefined> = [];
  minDate: Date = new Date(Date.now())

  initialForm: FormGroup = new FormGroup({
    tripTypeControl: new FormControl<string>('', Validators.required),
    departureLocation: new FormControl<string>('', Validators.required),
    destinationLocation: new FormControl<string>('', Validators.required),
    departureDate: new FormControl<Date | null>(null),
    dateRange: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null)
    }),
    passengerControl: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(9)]),
    flightClass: new FormControl<string | null>(null, Validators.required)
  })

  tripOptions = [
    { description: 'One-way', value: 'one-way' },
    { description: 'Round-trip', value: 'round-trip' }
  ];

  flightClassOptions = [
    { description: 'Economy', value: 'economy', preferred: false },
    { description: 'Business', value: 'business', preferred: false },
    { description: 'First class', value: 'first-class', preferred: true }
  ];

  cityOptions: string[] = citiesJSON.cities;
  filteredDepartureCities: Observable<string[]> | undefined;
  filteredDestinationCities: Observable<string[]> | undefined;

  constructor() {
  }

  private _filter(value: string): string[] {
    const filterValue = value?.toLowerCase();
    return this.cityOptions.filter(option => option?.toLowerCase().includes(filterValue))
  }

  ngOnInit(): void {
    this.filteredDepartureCities = this.initialForm.get('departureLocation')?.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      map(value => this._filter(value))
    )
    this.filteredDestinationCities = this.initialForm.get('destinationLocation')?.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      map(value => this._filter(value))
    )

    // Conditional Validation
    const flightTypeSub = this.initialForm.get('tripTypeControl')?.valueChanges.subscribe(changes => {
      const deepartureDate = this.initialForm.get('departureDate');
      const rangeStart = this.initialForm.get('dateRange.start');
      const rangeEnd = this.initialForm.get('dateRange.end');

      if (changes === 'one-way') {
        // set one-way validator
        deepartureDate?.setValidators([Validators.required]);
        // clear round-trip validators
        rangeStart?.setValidators([]);
        rangeEnd?.setValidators([]);
      } else {
        // set round-trip validators
        rangeStart?.setValidators([Validators.required]);
        rangeEnd?.setValidators([Validators.required]);
        // clear one-way validators
        deepartureDate?.setValidators([]);
      }
      deepartureDate?.updateValueAndValidity();
      rangeStart?.updateValueAndValidity();
      rangeEnd?.updateValueAndValidity();
    });

    this.subscriptions.push(flightTypeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
