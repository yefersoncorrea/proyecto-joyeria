import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';



export const MaterialRoutes: Routes = [
    {
        path:'categoria',
        component:ManageCategoryComponent,
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']
        }
    },
    {
        path:'producto',
        component:ManageProductComponent,
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']
        }
    },
    {
        path:'pedido',
        component:ManageOrderComponent,
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin','user']
        }
    },

    {
        path:'factura',
        component:ViewBillComponent,
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin','user']
        }
    },

    {
        path:'user',
        component:ManageUserComponent,
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']
        }
    }
];
