import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResponseResetComponent } from './response-reset/response-reset.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddRoleComponent } from './add-role/add-role.component';

import { PostProductComponent } from './post-product/post-product.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { CategoriesComponent } from './categories/categories.component';
import { BrandComponent } from './brand/brand.component';
import { MyordersComponent } from './myorders/myorders.component';
import { MyproductsComponent } from './myproducts/myproducts.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { SettingsComponent } from './settings/settings.component';
import { AddressComponent } from './address/address.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
//import { IndexComponent } from './index/index.component';
import { AboutComponent } from './about/about.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ServicesComponent } from './services/services.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ShopCategoryComponent } from './shop-category/shop-category.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { RolesComponent } from './roles/roles.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { BrandDetailsComponent } from './brand-details/brand-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'request-reset-password',component: RequestResetComponent},
  {path: 'response-reset-password/:token',component: ResponseResetComponent},
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'update-user/:id', component: UserDetailsComponent },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  { path: 'admin/manage-orders/:id', component: ManageOrdersComponent },
  { path: 'user/add-user', component: AddUserComponent },
  { path: 'product/:id', component: ProductsComponent },
  { path: 'cart', component: CartComponent},
  { path: 'categories', component: CategoriesComponent,},
  { path: 'categories/add-category', component: AddCategoryComponent,},
  { path: 'category-details/:id', component: CategoryDetailsComponent,},
  { path: 'brands', component: BrandComponent,},
  { path: 'brands/add-brand', component: AddBrandComponent,},
  { path: 'brand-details/:id', component: BrandDetailsComponent,},
  { path: 'roles/add-roles', component: AddRoleComponent },
  { path: 'roles', component: RolesComponent,},
  { path: 'role-details/:id', component: RoleDetailsComponent,},
  { path: 'shop-category', component: ShopCategoryComponent,},
  { path: 'profile/orders', component: MyordersComponent,},
  { path: 'profile', component: ProfileComponent,},
  { path: 'profile/postproduct', component: PostProductComponent ,},
  { path: 'profile/myproducts', component: MyproductsComponent ,},
  { path: 'profile/myproducts/:id', component: ProductDetailsComponent ,},
  { path: 'profile/settings', component: SettingsComponent ,},
  { path: 'profile/address', component: AddressComponent,},
  { path: 'order/:id', component: OrderdetailsComponent,},
  { path: 'order-success', component: OrderSuccessComponent ,},
  { path: 'order-tracking/:id', component: OrderTrackingComponent },
  { path: 'order-receipt/:id', component: ReceiptComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// { path: 'categories', component: CategoriesComponent,canActivate : [AuthGuardService]},
//   { path: 'profile/orders', component: MyordersComponent,canActivate : [AuthGuardService]},
//   { path: 'profile', component: ProfileComponent,canActivate : [AuthGuardService]},
//   { path: 'profile/postproduct', component: PostProductComponent ,canActivate : [AuthGuardService]},
//   { path: 'profile/myproducts', component: MyproductsComponent ,canActivate : [AuthGuardService]},
//   { path: 'profile/myproducts/:id', component: ProductDetailsComponent ,canActivate : [AuthGuardService]},
//   { path: 'profile/settings', component: SettingsComponent ,canActivate : [AuthGuardService]},
//   { path: 'profile/address', component: AddressComponent,canActivate : [AuthGuardService]},
//   { path: 'order/:id', component: OrderdetailsComponent,canActivate : [AuthGuardService]},
//   { path: 'order-success', component: OrderSuccessComponent ,canActivate : [AuthGuardService]},