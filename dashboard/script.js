//const urlApi = "http://localhost:3333"
const urlApi = "https://delivery-control-bkend.herokuapp.com"
const modal = document.querySelector("#modal"),
close = document.querySelector("#close"),
message = document.querySelector("#message");
const txtUnities = document.querySelector("#txtUnities"),
company = document.querySelector("#company"),
packageCod = document.querySelector("#packageCod"),
dateArrival = document.querySelector("#dateArrival"),
unity = document.querySelector("#unity"),
submitBtn = document.querySelector("#button"),
btnSearch = document.querySelector("#btnSearch"),
unitiesDataList = document.querySelector("#unities"),
unities = document.querySelector("#unities"),
list = document.querySelector(".list")

let globalList = []
let token = "";

dateArrival.value = new Date().toISOString().slice(0, 10)

submitBtn.addEventListener("click", () => {
    if(txtUnities.value === "") {
        txtUnities.focus()
        message.innerText = "Informe o Apartamento"
        modal.style.display = "block";
        return
    }
    createPackage()    
});

btnSearch.addEventListener("click", () => {
    searchPackages()
});

close.addEventListener("click", () => {
    modal.style.display = "none"
    if(message.innerText === "Informe o Apartamento") txtUnities.focus()
});

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

function createPackage(){
    const unity_id = document.querySelector('option[value="' + txtUnities.value + '"]').id
    const url = urlApi + "/create-package"
    const body = {
        "unity_id": unity_id,
        "company": company.value,
        "package_cod": packageCod.value,
        "dateArrival": dateArrival.value, 
        "dateDelivery": "0",
        "status": "Cadastrado"
    }

    axios.post(url, body, { 
        headers: {
            "Authorization" : `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    .then(response => {
        if(!response.data.error){
            getPackages()
            message.innerText = "Pacote cadastrado com sucesso!"
        }
        else{
            message.innerText = response.data.error
        }
        modal.style.display = "block";

    })
    .catch(error => {
        console.log(error)
    })
}    
          
function insertRowList(data){   
    list.innerHTML = ""
    globalList = []
    data.forEach(element => {
        // var found = globalList.find(function(item, index) {
        //     if(item._id == element._id)
        //         return true;
        // });
        // if(!found)
        // {
            //console.log(element)
        // if(element.status === "Cadastrado"){
            insertRow(element)
            globalList.push(element)
        // }
        //}
    });
    
}

function insertRow(element){
    const row = document.createElement("div")
    row.classList.add("row")
    const colCompany = document.createElement("div"),
    colUnity = document.createElement("div"),
    colPackageCod = document.createElement("div"),
    colDate = document.createElement("div"),
    colStatus  = document.createElement("div"),
    colDeliver  = document.createElement("div"),
    colDelete  = document.createElement("div");

    colUnity.classList.add("col-unity")
    colUnity.innerText = element.unity != null && element.unity.length > 0 ?
                            element.unity[0].apartment + " " + element.unity[0].block : ""
    row.appendChild(colUnity)

    colCompany.classList.add("col-company")
    colCompany.innerText = element.company
    row.appendChild(colCompany)

    colPackageCod.classList.add("col-package-cod")
    colPackageCod.innerText = element.package_cod
    row.appendChild(colPackageCod)

    colDate.classList.add("col-date")
    colDate.innerText = element.dateArrival
    row.appendChild(colDate)

    colStatus.classList.add("col-status")
    colStatus.innerText = element.status
    row.appendChild(colStatus)

    colDeliver.classList.add("col-deliver")
    if(element.status === "Cadastrado"){
        const button = document.createElement("INPUT");
        button.setAttribute("type", "button");
        button.setAttribute("value", "Entregar")
        button.setAttribute("onclick", `deliver('${element._id}')`)
        colDeliver.appendChild(button)
    }
    row.appendChild(colDeliver)

    colDelete.classList.add("col-delete")
    colDelete.innerHTML = `<i class="far fa-trash-alt 5x" onclick="deletePackage('${element._id}')"></i>`
    row.appendChild(colDelete)

    list.appendChild(row)
}

function getPackages(){
    const url = urlApi + "/get-packages"
    axios.get(url, { 
        headers: {
            "Authorization" : `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    .then(response => {
        response.data
        .sort((a, b) => {
            if (a._id > b._id) return -1
            if (a._id < b._id) return 1
            return 0
        })
        .sort((a, b) => {
            if (a.status > b.status) return 1
            if (a.status < b.status) return -1
            return 0
        })
        insertRowList(response.data)        
    })
    .catch(error => {
        console.log(error)
    })
}
getPackages()

function searchPackages(){
    if(txtUnities.value === ""){
        getPackages()
    }
    else{
        const unity_id = document.querySelector('option[value="' + txtUnities.value + '"]').id
        const data = globalList.filter(p => p.unity_id === unity_id)
        list.innerHTML = ""
        data.forEach(element => {
            insertRow(element)       
        });
    }    
}

function getUnities(){    
    unitiesDataList.innerHTML = ""
    
    const urlUnities = urlApi + "/get-unities"    
    
    axios.get(urlUnities, { headers: {"Authorization" : `Bearer ${sessionStorage.getItem("token")}`}})
    .then(response => {
        let unities = response.data
        .sort((a, b) => {
            if (a.apartment > b.apartment) return 1
            if (a.apartment < b.apartment) return -1
            return 0
        })
        .sort((a, b) => {
            if (a.block > b.block) return 1
            if (a.block < b.block) return -1
            return 0
        })
        
        unities.forEach(unity => {
            var option = document.createElement('option');
            option.value = unity.apartment + ' - ' + unity.block;
            if(unity.addressees.length > 0){
                unity.addressees.forEach(element => {
                    option.label += element.name + " "
                });
            }
            option.id = unity._id
            unitiesDataList.appendChild(option);
        });
    })
    .catch(error => console.log("Erro ao buscar unidades"))
}
getUnities()

function deliver(package_id){    
    const url = urlApi + "/deliver-package/" + package_id
    const body = {
        "dateArrival": dateArrival.value, 
        "status": "Entregue"
    }
    
    axios.post(url, body, { 
        headers: {
            "Authorization" : `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    .then(response => {
        if(response.status === 200){
            getPackages()
            message.innerText = "Pacote entregue com sucesso!"
            modal.style.display = "block";
        }
    })
    .catch(error => {
        console.log(error)
    })
}

function deletePackage(package_id){    
    const url = urlApi + "/delete-package/" + package_id
    
    axios.delete(url, { 
        headers: {
            "Authorization" : `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    .then(response => {
        if(response.status === 200){
            getPackages()
            message.innerText = "Pacote Deletado com sucesso!"
            modal.style.display = "block";
        }
    })
    .catch(error => {
        console.log(error)
    })
}

txtUnities.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        company.focus()
    }
});
company.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        packageCod.focus()  
    }
});
packageCod.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        dateArrival.focus()
    }
});
dateArrival.addEventListener("keyup", function(event) {
    enterClick(event)
});
  
function enterClick(event){
    if (event.keyCode === 13) {
        event.preventDefault();
        submitBtn.click();    
    }
}

