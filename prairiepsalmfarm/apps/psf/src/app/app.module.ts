import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import {AccordionModule} from 'primeng/accordion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@prairiepsalmfarm/products';
import { UiModule } from '@prairiepsalmfarm/ui';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrdersModule } from '@prairiepsalmfarm/orders';
import { ToastModule } from 'primeng/toast';
import { MessagesComponent } from './shared/messages/messages.component';
import { MessageService } from 'primeng/api';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { JwtInterceptor } from '@prairiepsalmfarm/users';
import { NgxStripeModule } from 'ngx-stripe';

const routes: Routes = [
  {path: '', component: HomePageComponent}
]

@NgModule({
  declarations: [
    AppComponent, 
    HomePageComponent, 
    HeaderComponent, 
    FooterComponent, 
    NavComponent,
    MessagesComponent
  ],
  imports: [
    HttpClientModule, 
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes), 
    AccordionModule, 
    ProductsModule, 
    UiModule,
    OrdersModule,
    ToastModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    NgxStripeModule.forRoot('pk_test_51L8slaJ4viPmyObIjCIQ29mRqrHKMHBcf1HGcwVz4iUgKY4qHEkZ9kyASo372VqIMr2nvlZhWryfBoYyabFi3172007gzs3mrf')
  ],
  providers: [MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}],
  bootstrap: [AppComponent],
  exports: [
    
  ],
})

export class AppModule {}
