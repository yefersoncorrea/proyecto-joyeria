import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'categoria', 'precio', 'cantidad', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  precio: any;
  cantidadTotal: number = 0;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      nombre: [null, [Validators.required, Validators.pattern(GlobalConstants.nombreRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      numeroContacto: [null, [Validators.required, Validators.pattern(GlobalConstants.numeroContactoRegex)]],
      metodoPago: [null, [Validators.required]],
      producto: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      cantidad: [null, [Validators.required]],
      precio: [null, [Validators.required]],
      total: [0, [Validators.required]]
    })
  }

  getCategorys() {
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.ngxService.stop();
      this.categorys = response;
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  getProductsByCategory(value: any) {
    this.productService.getProductsByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.controls['precio'].setValue('');
      this.manageOrderForm.controls['cantidad'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((response: any) => {
      this.precio = response.precio;
      this.manageOrderForm.controls['precio'].setValue(response.precio);
      this.manageOrderForm.controls['cantidad'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.precio * 1);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['cantidad'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['cantidad'].value * this.manageOrderForm.controls['precio'].value);
    }
    else if (temp != '') {
      this.manageOrderForm.controls['cantidad'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['cantidad'].value * this.manageOrderForm.controls['precio'].value);
    }
  }

  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['cantidad'].value <= 0)
      return true;

    else
      return false;
  }

  validateSubmit() {
    if (this.cantidadTotal === 0 || this.manageOrderForm.controls['nombre'].value === null ||
      this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['numeroContacto'].value === null ||
      this.manageOrderForm.controls['metodoPago'].value === null ||
      !(this.manageOrderForm.controls['numeroContacto'].valid) || !(this.manageOrderForm.controls['email'].valid))
      return true;

    else
      return false;
  }

  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: { id: number }) => e.id == formData.producto.id);
    if (productName === undefined) {
      this.cantidadTotal = this.cantidadTotal + formData.total;
      this.dataSource.push({
        id: formData.producto.id, nombre: formData.producto.nombre, categoria: formData.categoria.nombre,
        cantidad: formData.cantidad, precio: formData.precio, total: formData.total
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded,"success");
    }
    else {
      this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  handleDeleteAction(value:any,element:any){
    this.cantidadTotal = this.cantidadTotal - element.total;
    this.dataSource.splice(value,1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    this.ngxService.start();
    var formData = this.manageOrderForm.value;
    var data = {
      nombre:formData.nombre,
      email:formData.email,
      numeroContacto:formData.numeroContacto,
      metodoPago:formData.metodoPago,
      cantidadTotal:this.cantidadTotal,
      detallesProducto: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.cantidadTotal =0;
    },(error:any)=>{
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  downloadFile(fileName:any){
    var data = {
      uuid:fileName
    }
    this.billService.getPDF(data).subscribe((response:any)=>{
      saveAs(response,fileName+'.pdf');
      this.ngxService.stop();
    })
  }

}
