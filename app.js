//variables

const ListaMenus = document.querySelector("#root");
const resumenPedido = document.querySelector("table tbody");
const Totalconsumos=document.querySelector("#totalConsumo");

const mesa={
   Pedido:[] 
}

const categorias={
    1:"comidas",
    2:"bebida",
    3:"postre"
}



document.addEventListener("DOMContentLoaded", llamarApi);

function llamarApi() {
  fetch("http://localhost:4000/platillos")
    .then((response) => response.json())
    .then((response) => MostrarMenus(response))
    .catch((err) => console.error(err));
}

function MostrarMenus(response) {

  const DivPrincipal = document.createElement("div");
  DivPrincipal.classList.add("row");

  response.forEach((element) => {
    const { nombre, precio, descripcion, url } = element;

    const div = document.createElement("div");
    div.classList.add("col-md-3", "card", "mt-3", "mx-2", "mx-auto","h-10");
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
        
        agregarPedido({...element,cantidad:1});
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
