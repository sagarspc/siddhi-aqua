import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { RestApiService } from './rest-api.service';
import { DataService } from './data.service';
import { SharedSubjectService } from './shared-subject.service';
import { AuthGuardService } from './auth-guard.service';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { ProfileComponent } from './profile/profile.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrModule } from 'ngx-toastr';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { AddUserComponent } from './add-user/add-user.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { PostProductComponent } from './post-product/post-product.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { CategoriesComponent } from './categories/categories.component';
import { MyordersComponent } from './myorders/myorders.component';
import { MyproductsComponent } from './myproducts/myproducts.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { SettingsComponent } from './settings/settings.component';
import { AddressComponent } from './address/address.component';
import { MessageComponent } from './message/message.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { IndexComponent } from './index/index.component';
import { AboutComponent } from './about/about.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ServicesComponent } from './services/services.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ShopCategoryComponent } from './shop-category/shop-category.component';
import { BrandComponent } from './brand/brand.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { RolesComponent } from './roles/roles.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { BrandDetailsComponent } from './brand-details/brand-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResponseResetComponent } from './response-reset/response-reset.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    BoardAdminComponent,
    BoardUserComponent,
    BoardModeratorComponent,
    ProfileComponent,
    AddUserComponent,
    AddRoleComponent,
    PostProductComponent,
    ProductsComponent,
    CartComponent,
    CategoriesComponent,
    MyordersComponent,
    MyproductsComponent,
    OrderdetailsComponent,
    OrderSuccessComponent,
    OrderTrackingComponent,
    SettingsComponent,
    AddressComponent,
    MessageComponent,
    AdminOrdersComponent,
    IndexComponent,
    AboutComponent,
    ContactsComponent,
    ServicesComponent,
    ReceiptComponent,
    ProductDetailsComponent,
    AddCategoryComponent,
    CategoryDetailsComponent,
    UserDetailsComponent,
    ShopCategoryComponent,
    BrandComponent,
    ManageOrdersComponent,
    AddBrandComponent,
    RolesComponent,
    RoleDetailsComponent,
    BrandDetailsComponent,
    DashboardComponent,
    RequestResetComponent,
    ResponseResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxSpinnerModule
  ],
  providers: [authInterceptorProviders,RestApiService, DataService, AuthGuardService,SharedSubjectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
