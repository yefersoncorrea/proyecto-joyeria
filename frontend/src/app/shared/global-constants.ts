export class GlobalConstants{
    //mensaje
    public static genericError:string = "Algo salio mal. Por favor intente de nuevo mas tarde";

    public static unauthorized: string = "No eres una persona autorizada para acceder a esta pagina.";

    public static productExistError:string = "Producto ya existe.";

    public static productAdded:string = "Producto agregado exitosamente.";

    //rechazos
    public static nombreRegex:string = "[a-zA-Z0-9 ]*";

    public static emailRegex:string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static numeroContactoRegex:string = "^[e0-9]{10,10}$";

    //variable
    public static error: string = "error";
}