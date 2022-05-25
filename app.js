//variables

const ListaMenus = document.querySelector("#root");
const resumenPedido = document.querySelector("table tbody");
const Totalconsumos=document.querySelector("#totalConsumo");
const mesaNUmero=document.querySelector("#Mesa");
const mozo=document.querySelector("#Mozo")
const BtnGuardarPedido=document.querySelector("#btnGuardar")

let EditarPedido=false;

ListaMesas=[]

const mesa={
    mesa:"",
    mozo:"",
   Pedido:[] 
}

const categorias={
    1:"comidas",
    2:"bebida",
    3:"postre"
}



document.addEventListener("DOMContentLoaded", llamarApi);
BtnGuardarPedido.addEventListener("click",ListaDeMesas)


function llamarApi() {

  fetch("http://localhost:4000/platillos")
    .then((response) => response.json())
    .then((response) => {
        
        if(response) {
    
            MostrarMenus(response)

        }
        })
        .catch((err) => 
        
        fetch("db.json")
        .then((response) => response.json())
        .then((response) => {

            MostrarMenus(response.platillos)
        }));
    
}

function MostrarMenus(response) {

  const DivPrincipal = document.createElement("div");
  DivPrincipal.classList.add("row");

  response.forEach((element) => {
    const { nombre, precio, descripcion, url } = element;

    const div = document.createElement("div");
    div.classList.add("col-md-3", "card", "mt-3", "mx-2", "mx-auto","h-10","my-1");
    div.style.width = "10rem";

    const parrafo = document.createElement("p");
    parrafo.innerHTML = `<h3>${nombre}</h3>`;

    const imgElement = document.createElement("img");
    imgElement.classList.add("h-50","img-fluid");
    imgElement.src = url;

    const pPrecio = document.createElement("p");
    pPrecio.innerHTML = `<h4>$ ${precio}</h4>`;

    const Button = document.createElement("button");
    Button.classList.add("btn", "btn-primary", "btn-block");
    Button.innerHTML = "Agregar";
    Button.onclick= function() {
        
            const VaciosCampos=[mesaNUmero.value,mozo.value].some(campo=>campo==="");

            if(VaciosCampos){

                swal({
                    title: "Atencion!",
                    text: "Debes seleccionar la mesa y el mozo !",
                    icon: "error",
                });
            }else{

                mesa.mesa=mesaNUmero.value;
                mesa.mozo=mozo.value;

                agregarPedido({...element,cantidad:1});

            }
    }


    div.appendChild(parrafo);
    div.appendChild(imgElement);
    div.appendChild(pPrecio);
    div.appendChild(Button);
    DivPrincipal.appendChild(div);

    ListaMenus.appendChild(DivPrincipal);
  });
}

function agregarPedido(Menu){

const {Pedido} = mesa;

const existemenu= Pedido.some(plato=> plato.id === Menu.id);

if(existemenu){
   
    Pedido.map(plato=>{

        if(plato.id === Menu.id){
            plato.cantidad+=1;
        }
        return plato;
    })


}else{
    mesa.Pedido=[...Pedido, Menu]; 
}

mostrarResumen(mesa.Pedido)
BtnGuardarPedido.classList.remove("d-none");
}

function mostrarResumen(ListaMenus){

    while(resumenPedido.firstChild){
        resumenPedido.removeChild(resumenPedido.firstChild);
    }

    ListaMenus.forEach(plato=>{

        const {nombre,precio,cantidad,url}=plato;

        const fila=document.createElement("tr");
        fila.innerHTML=`
        <td>${nombre}<img src="${url}" alt="" style="width:70px;height: 40px;" class="mx-3 rounded"></td>
        <td >${cantidad}</td>
        <td>${precio}</td>
        <td>${precio*cantidad}</td>
        <td>
        <button class="btn btn-warning" onclick="RestarPlatillo(${plato.id})">-</button>
        <button class="btn btn-danger" onclick="eliminarPedido(${plato.id})">X</button>
        </td>
        `;
        resumenPedido.appendChild(fila);
    })

    document.querySelector("#mesaCliente").innerHTML=`<h3>Mesa: ${mesa.mesa}</h3>`;
    document.querySelector("#mesaMozo").innerHTML=`<h3>Mozo: ${mesa.mozo}</h3>`;
    CalcularTotal()
    

   
}

function eliminarPedido(id){

    mesa.Pedido=mesa.Pedido.filter(plato=>plato.id!==id);
    mostrarResumen(mesa.Pedido);

}

function RestarPlatillo(id){

    mesa.Pedido=mesa.Pedido.map(plato=>{

if(plato.id===id && plato.cantidad>1){
plato.cantidad--;

}
return plato;
    })


mostrarResumen(mesa.Pedido);
}

function CalcularTotal(){

    //let total=0;
    // mesa.Pedido.forEach(plato=>{
    //     total+=plato.precio*plato.cantidad;
    // })

    const total=mesa.Pedido.reduce((total,plato)=>{

return total+plato.precio*plato.cantidad;

    },0)

    Totalconsumos.innerHTML=`<h3>Total Consumido: $ ${total}</h3>`;
}

///agregar al listado de mesas

function ListaDeMesas() {

    while(resumenPedido.firstChild){
        resumenPedido.removeChild(resumenPedido.firstChild);
    }

    mesaNUmero.value="";
    mozo.value="";

    BtnGuardarPedido.classList.add("d-none");

    document.querySelector("#mesaCliente").innerHTML=``;
    document.querySelector("#mesaMozo").innerHTML=``;
    Totalconsumos.innerHTML=``;


if(EditarPedido){
    
ListaMesas.map(me=>{

    if(me.mesa===mesa.mesa){
        me.mesa=mesa.mesa;
        me.mozo=mesa.mozo;
        me.Pedido=mesa.Pedido;
    }
    return me;
})
   
mesa.mesa="";
mesa.mozo="";
mesa.Pedido=[];

EditarPedido=false;
BtnGuardarPedido.textContent="Guardar";

mesaNUmero.readOnly=false;
mozo.disabled=false;

swal({
    title: "Pedido Editado!",
    icon: "success",
});

}else{
    
    const ExisteMesaGuardada=ListaMesas.some(Plato=> Plato.mesa==mesa.mesa);

    console.log("🚀 ~ file: app.js ~ line 255 ~ ListaDeMesas ~ ExisteMesaGuardada", ExisteMesaGuardada)

    if(ExisteMesaGuardada){

        swal({
            title: "Atencion!",
            text: "La mesa ya esta ocupada!",
            icon: "error",
        });
    
    }else{
    
        ListaMesas.push({...mesa});
       console.log(ListaMesas); 
       MostrarPedidoGuardados(ListaMesas)
       swal({
        title: "Pedido Guardado!",
        icon: "success",
    });
    }
    
    
      mesa.mesa="";
      mesa.mozo="";
      mesa.Pedido=[];

}


}

function MostrarPedidoGuardados(mesasOcupada){

const ListaMesaLLenas=document.querySelector("#mesaLlena");

while(ListaMesaLLenas.firstChild){

    ListaMesaLLenas.removeChild(ListaMesaLLenas.firstChild);

}

    mesasOcupada.forEach(mesaUsada=>{

const DivPrincipal=document.createElement("div");
DivPrincipal.classList.add("col-sm-12","shadow","rounded","bg-gradient","border-bottom","justify-content-start");
const Parrafo= document.createElement("p");
Parrafo.innerHTML=`<h5>Mesa: ${mesaUsada.mesa} Mozo: ${mesaUsada.mozo}</h5>`;
const Button=document.createElement("button");
Button.classList.add("btn", "btn-warning", "btn-block","mx-1");

Button.innerHTML="Editar";

Button.onclick=function(){

    mesa.mesa=mesaUsada.mesa;
    mesa.mozo=mesaUsada.mozo;
    mesa.Pedido=mesaUsada.Pedido;
   
 

    BtnGuardarPedido.classList.remove("d-none");
    BtnGuardarPedido.textContent="Editar Pedido";

    EditarPedido=true;

    mesaNUmero.value=mesa.mesa
    mozo.value=mesa.mozo
    mesaNUmero.readOnly=true
    mozo.disabled=true


    mostrarResumen(mesaUsada.Pedido)

    console.log(mesa)
}

const ButtonEliminar=document.createElement("button");
ButtonEliminar.classList.add("btn", "btn-danger", "btn-block", "mx-1");
ButtonEliminar.innerHTML="Borrar";

ButtonEliminar.onclick=function(){

    swal({
        title: "Estas seguro que deseas Eliminar el Pedido?",
        text: "Esta accion es irreversible !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    .then((value) => {

        if(value){

            while(ListaMesaLLenas.firstChild){

                ListaMesaLLenas.removeChild(ListaMesaLLenas.firstChild);
            
            }
    
            while(resumenPedido.firstChild){
                resumenPedido.removeChild(resumenPedido.firstChild);
            }
    
            mesaNUmero.value="";
            mozo.value="";
            BtnGuardarPedido.classList.add("d-none");
    
            document.querySelector("#mesaCliente").innerHTML=``;
            document.querySelector("#mesaMozo").innerHTML=``;
            Totalconsumos.innerHTML=``;
    
            ListaMesas=ListaMesas.filter(mesa=>mesa.mesa!==mesaUsada.mesa);
            MostrarPedidoGuardados(ListaMesas)

           
            
            swal({
                title: "Pedido Eliminado!",
                icon: "success",
            });
            mesaNUmero.readOnly=false
            mozo.disabled=false
        }

             
    });

}

const buttonBoleta= document.createElement("button");
buttonBoleta.classList.add("btn", "btn-success", "btn-block","mx-1");
buttonBoleta.setAttribute("data-bs-toggle","modal");
buttonBoleta.setAttribute("data-bs-target","#exampleModal");
buttonBoleta.innerHTML="Boleta";

buttonBoleta.onclick=function(){
    
    mesa.mesa=  mesaUsada.mesa;
    mesa.mozo=  mesaUsada.mozo;
    CrearBoleta(mesaUsada.Pedido)

}



Parrafo.appendChild(Button);
Parrafo.appendChild(ButtonEliminar);
Parrafo.appendChild(buttonBoleta);


DivPrincipal.appendChild(Parrafo);

ListaMesaLLenas.appendChild(DivPrincipal);

    })

}

function CrearBoleta(Mesas){
console.log("🚀 ~ file: app.js ~ line 395 ~ CrearBoleta ~ Mesas", Mesas)


    const fechaBoleta= document.querySelector("#fechaBoleta");
    const mesaBoleta= document.querySelector("#mesaBoleta");
    const mozoBoleta= document.querySelector("#mozoBoleta");

    const BoletaResumen=document.querySelector("#BoletaResumen")
    const TotalDiv=document.querySelector("#TotalAcobrar")

    let fecha=moment().format('DD/MM/YYYY HH:mm'); 
    fechaBoleta.innerHTML=fecha;

    mesaBoleta.innerHTML=`${mesa.mesa}`
    mozoBoleta.innerHTML=`${mesa.mozo}`

    while(BoletaResumen.firstChild){

        BoletaResumen.removeChild(BoletaResumen.firstChild);
    
    }

    
    while(TotalDiv.firstChild){

        TotalDiv.removeChild(TotalDiv.firstChild);
    
    }

const Div= document.createElement("div");
Div.classList.add("row", "align-items-end");

const SubtotalApagar=Mesas.reduce((total, plato)=>total+plato.cantidad*plato.precio,0)
const Propina=SubtotalApagar*0.10
const Total=SubtotalApagar+Propina

const Subtotal= document.createElement("h3");
Subtotal.classList.add("text-right","my-2");
Subtotal.innerHTML=`<h3>Sub-total: ${SubtotalApagar}</h3>`;

const PropinaApagar= document.createElement("h3");
PropinaApagar.classList.add("text-right");
PropinaApagar.innerHTML=`<h3>Propina: ${Propina}</h3>`;

const TotalApagar= document.createElement("h3");
TotalApagar.classList.add("text-right");
TotalApagar.innerHTML=`<h3>Total: ${Total}</h3>`;


    Mesas.forEach(plato=>{

        const {nombre,precio,cantidad,url}=plato;

        const fila=document.createElement("tr");
        fila.innerHTML=`
        <td>${nombre}<img src="${url}" alt="" style="width:70px;height: 40px;" class="mx-3 rounded"></td>
        <td >${cantidad}</td>
        <td>${precio}</td>
        <td>${precio*cantidad}</td>
        `;

        Div.appendChild(fila);
        Div.appendChild(Subtotal);
        Div.appendChild(PropinaApagar);
        Div.appendChild(TotalApagar);


        document.querySelector("#BoletaResumen").appendChild(fila);
        document.querySelector("#TotalAcobrar").appendChild(Div);
       
       
    })
   
}