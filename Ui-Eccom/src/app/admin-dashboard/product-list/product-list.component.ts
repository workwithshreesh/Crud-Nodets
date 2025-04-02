import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/Services/product.service';
import { ProductDataService } from 'src/app/Services/product-data.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  
  allProducts$!: Observable<any[]>;  
  baseUrl: string = environment.baseUrl + "/uploads/";
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private productDataService: ProductDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.allProducts$ = this.productService.getProducts();

    this.allProducts$.subscribe({
      next: () => (this.isLoading = false),
      error: (err) => {
        console.error('Error fetching products:', err);
        this.errorMessage = 'Failed to load products. Please try again.';
        this.isLoading = false;
      }
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-image.png';
  }

  onEditClick(product: any) {
    this.productDataService.setProductData(product);
    this.router.navigate(['/edit-product']); // Navigate instead of modal
  }

  addNew() {
    this.productDataService.clearProductData();
    this.router.navigate(['/add-product']);
  }

  onDeleteClick(product: any) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => this.fetchProducts(), // Refresh list
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }

  ngOnDestroy(): void {}
}
