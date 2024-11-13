import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    { state: 'dashboard', name: 'dashboard', icon: 'dashboard', role: '' },
    { state: 'categoria', name: 'Administrar Categoria', icon: 'category', role: '' },
    { state: 'producto', name: 'Administrar Producto', icon: 'inventory_2', role: '' },
    { state: 'pedido', name: 'Administrar Pedido', icon: 'list_alt', role: '' },
    { state: 'factura', name: 'Ver Factura', icon: 'import_contacts', role: '' },
    { state: 'user', name: 'Ver Usuario', icon: 'people', role: '' }
];

@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}