import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Services/product.service';
import { ProductDataService } from 'src/app/Services/product-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  productSubscription!: Subscription;
  productId: number | null = null;
  skuExistError: boolean = false;
  baseUrl: string = environment.baseUrl + "/uploads/";

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private productDataService: ProductDataService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.productSubscription = this.productDataService.currentProduct.subscribe(product => {
      if (product) {
        this.productId = product.id;
        this.populateForm(product);
      } else {
        this.productId = null;
        this.resetForm();
      }
    });
  }

  initializeForm() {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      images: [[]]
    });
  }

  populateForm(product: any) {
    this.productForm.patchValue({
      sku: product.sku,
      name: product.name,
      price: product.price
    });
    this.imagePreviews = product.images ? product.images.map((img: any) => this.baseUrl + img.image_url) : [];
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFiles = Array.from(fileInput.files);
      this.imagePreviews = [];

      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('sku', this.productForm.get('sku')?.value);
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        formData.append('images', file, file.name);
      });
    }

    if (this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe(
        () => {
          alert('Product updated successfully!');
          this.productDataService.clearProductData();
          this.resetForm();
        },
        error => {
          console.error('Update failed:', error);
        }
      );
    } else {
      this.productService.createProduct(formData).subscribe(
        () => {
          alert('Product added successfully!');
          this.resetForm();
        },
        error => {
          console.error('Creation failed:', error);
        }
      );
    }
  }

  closeModal() {
    this.productDataService.clearProductData();
  }

  resetForm() {
    this.productForm.reset();
    this.imagePreviews = [];
    this.selectedFiles = [];
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
