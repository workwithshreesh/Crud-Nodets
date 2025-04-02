import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDashboardComponent } from './admin-dashboard/product-dashboard/product-dashboard.component';
import { ProductListComponent } from './admin-dashboard/product-list/product-list.component';
import { AddEditComponent } from './admin-dashboard/add-edit/add-edit.component';

const routes: Routes = [
  {
    path:"",
    component:ProductDashboardComponent
  },
  {
    path:"product",
    component:ProductListComponent
  },
  {
    path:"add-product",
    component:AddEditComponent
  },
  {
    path:"edit-product",
    component:AddEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
