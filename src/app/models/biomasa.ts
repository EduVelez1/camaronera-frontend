export class Biomasa {
    constructor(
        public responsable: string = null,
        public fecha: string = null,
        public area_red: string = null,
        public cantidad_total: string = null,
        public cantidad_camarones: string = null,
        public dias_siembra: string = null,        
        public detalle: string = null,
        public produccion_id: string = null,
        // public datos: [{cantidad:string}] = [{cantidad: null}]
        public datos: any[] = [],
        public costo: string = null,


    ) {}
}