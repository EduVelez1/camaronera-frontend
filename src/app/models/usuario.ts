export class Usuario {
    constructor(
        public cedula: string = null,
        public nombres: string = null,
        public nick: string = null,
        public correo: string = null,
        public contrasena: string = null,
        public telefono: string = null,
        public descripcion: string = null,
        public role_id: string = '2',
        public estado_id: string = '1',
        public codigo: string = null,

    ) {}
}