import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './shared/footer/footer.component';
// angular material
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

import { MomentModule } from 'angular2-moment';

import { APP_ROUTES } from './app.routes';
import { PagesComponent } from './pages/pages.component';
import { CamaronerasComponent } from './pages/camaroneras/camaroneras.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistrarUsuarioComponent } from './pages/registrar-usuario/registrar-usuario.component';
import { VerUsuariosComponent } from './pages/ver-usuarios/ver-usuarios.component';
import { PiscinasComponent } from './pages/piscinas/piscinas.component';
import { ProduccionesActivasComponent } from './pages/producciones-activas/producciones-activas.component';
import { HistorialProduccionesComponent } from './pages/historial-producciones/historial-producciones.component';
import { DetalleProduccionComponent } from './pages/detalle-produccion/detalle-produccion.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { EditarUsuarioComponent } from './pages/editar-usuario/editar-usuario.component';
import { RegistroLarvaComponent } from './pages/registro-larva/registro-larva.component';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena.component';
import { InsertarCodigoComponent } from './insertar-codigo/insertar-codigo.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NopagefoundComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    FooterComponent,
    PagesComponent,
    CamaronerasComponent,
    InicioComponent,
    RegistrarUsuarioComponent,
    VerUsuariosComponent,
    PiscinasComponent,
    ProduccionesActivasComponent,
    HistorialProduccionesComponent,
    DetalleProduccionComponent,
    EditarUsuarioComponent,
    RegistroLarvaComponent,
    RecuperarContrasenaComponent,
    InsertarCodigoComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserAnimationsModule,  
    FullCalendarModule,
    MomentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
