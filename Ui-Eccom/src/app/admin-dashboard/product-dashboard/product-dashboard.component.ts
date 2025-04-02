import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.css']
})
export class ProductDashboardComponent implements OnInit, OnDestroy {
  
  retriveCartDataSubscribe!: Subscription;
  allDataProduct: any[] = [];
  Base_url: string = environment.baseUrl + "/uploads/";
  selectedProduct: any;
  isLoading: boolean = false;
  hasError: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProduct();
  }

  ngOnDestroy(): void {
    if (this.retriveCartDataSubscribe) {
      this.retriveCartDataSubscribe.unsubscribe();
    }
  }

  getAllProduct(): void {
    this.isLoading = true;
    this.hasError = false;

    this.retriveCartDataSubscribe = this.productService.getProducts().subscribe({
      next: (data) => {
        this.allDataProduct = data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error fetching products:", error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  openModal(product: any): void {
    this.selectedProduct = product;
  }
}
