import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export abstract class ApiService {
  protected constructor(protected http: HttpClient) { }
}