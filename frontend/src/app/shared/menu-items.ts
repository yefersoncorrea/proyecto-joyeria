import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    icon: string;
    rol: string;
}

const MENUITEMS = [
    { state: 'dashboard', name: 'dashboard', icon: 'dashboard', rol: '' },
    { state: 'categoria', name: 'Administrar Categoria', icon: 'category', rol: 'admin' },
    { state: 'producto', name: 'Administrar Producto', icon: 'inventory_2', rol: 'admin' },
    { state: 'pedido', name: 'Administrar Pedido', icon: 'list_alt', rol: '' },
    { state: 'factura', name: 'Ver Factura', icon: 'import_contacts', rol: '' },
    { state: 'user', name: 'Ver Usuario', icon: 'people', rol: 'admin' }
];

@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}