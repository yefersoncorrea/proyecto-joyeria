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
    { state: 'producto', name: 'Administrar Producto', icon: 'inventory_2', role: '' }
];

@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}