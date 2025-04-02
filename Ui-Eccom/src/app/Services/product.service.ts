import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../Interface/Product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private Base_URL = environment.baseUrl+"/products";

  constructor(private http: HttpClient) { }

  // GET all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.Base_URL).pipe(
      catchError(this.handleError)
    );
  }

  // GET product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.Base_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // POST create a new product
  createProduct(product: Product | FormData): Observable<Product> {
    return this.http.post<Product>(this.Base_URL, product).pipe(
      catchError(this.handleError)
    );
  }


  // PUT update an existing product
  updateProduct(id: number, product: Product | FormData): Observable<Product> {
    return this.http.put<Product>(`${this.Base_URL}/${id}`, product).pipe(
      catchError(this.handleError)
    );
  }


  // DELETE a product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.Base_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }
}
