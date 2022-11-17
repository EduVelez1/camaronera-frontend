import { RouterModule, Routes } from "@angular/router";
import { InsertarCodigoComponent } from "./insertar-codigo/insertar-codigo.component";
import { LoginComponent } from "./login/login.component";
import { CamaronerasComponent } from "./pages/camaroneras/camaroneras.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { DetalleProduccionComponent } from "./pages/detalle-produccion/detalle-produccion.component";
import { EditarUsuarioComponent } from "./pages/editar-usuario/editar-usuario.component";
import { HistorialProduccionesComponent } from "./pages/historial-producciones/historial-producciones.component";
import { InicioComponent } from "./pages/inicio/inicio.component";
import { PagesComponent } from "./pages/pages.component";
import { PiscinasComponent } from "./pages/piscinas/piscinas.component";
import { ProduccionesActivasComponent } from "./pages/producciones-activas/producciones-activas.component";
import { RegistrarUsuarioComponent } from "./pages/registrar-usuario/registrar-usuario.component";
import { RegistroLarvaComponent } from "./pages/registro-larva/registro-larva.component";
import { VerUsuariosComponent } from "./pages/ver-usuarios/ver-usuarios.component";
import { RecuperarContrasenaComponent } from "./recuperar-contrasena/recuperar-contrasena.component";
import { NopagefoundComponent } from "./shared/nopagefound/nopagefound.component";

const appRoutes: Routes = [
    // { path: '', component: LoginComponent },

    {
        path: '', 
        component: PagesComponent,
        children: [
            {path: '', component: InicioComponent},
            { path: 'dashboard', component: DashboardComponent },
            { path: 'inicio', component: InicioComponent },
            { path: 'registro-usuario', component: RegistrarUsuarioComponent },
            { path: 'editar-usuario/:id', component: EditarUsuarioComponent },
            { path: 'ver-usuario', component: VerUsuariosComponent },
            { path: 'ver-usuario/:tipoUsuario', component: VerUsuariosComponent },
            { path: 'camaroneras', component: CamaronerasComponent },
            { path: 'piscinas', component: PiscinasComponent },
            { path: 'producciones', component: ProduccionesActivasComponent },
            { path: 'historial-producciones', component: HistorialProduccionesComponent },
            { path: 'detalle/:id', component: DetalleProduccionComponent },
            { path: 'larva', component: RegistroLarvaComponent },

        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
    { path: 'insertar-codigo/:correo', component: InsertarCodigoComponent },

    //{ path: '', redirectTo:'/dashboard', pathMatch: 'full' },
    { path: '*', component: NopagefoundComponent }



];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true });