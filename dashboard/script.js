// page create-acount
const txtUnities = document.querySelector("#txtUnities"),
company = document.querySelector("#company"),
packageCod = document.querySelector("#packageCod"),
dateArrival = document.querySelector("#dateArrival"),
unity = document.querySelector("#unity"),
submitBtn = document.querySelector("#button"),
unitiesDataList = document.querySelector("#unities"),
unities = document.querySelector("#unities"),
list = document.querySelector(".list")

let globalList = []
let token = "";

dateArrival.value = new Date().toISOString().slice(0, 10)

const url = window.location.href
if(url.indexOf("token") > 0){
    const parts = url.split('?')
    token = parts[1].replace("token=", "")
    window.localStorage.setItem("token", token)
    window.location.href = parts[0].replace("index.html", "")
}

submitBtn.addEventListener("click", () => {
    console.log("clicou")
    createPackage()    
});

function createPackage(){
    const unity_id = document.querySelector('option[value="' + txtUnities.value + '"]').id
    const url = "https://delivery-control-bkend.herokuapp.com/create-package"
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
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        console.log(response)
        getPackages()
    })
    .catch(error => {
        console.log(error)
    })
}    
          
function insertRowList(data){   
    list.innerHTML = ""
    data.forEach(element => {
        // var found = globalList.find(function(item, index) {
        //     if(item._id == element._id)
        //         return true;
        // });
        // if(!found)
        // {
            //console.log(element)
            const row = document.createElement("div")
            row.classList.add("row")
            const colCompany = document.createElement("div"),
            colUnity = document.createElement("div"),
            colPackageCod = document.createElement("div"),
            colDate = document.createElement("div"),
            colStatus  = document.createElement("div"),
            colDeliver  = document.createElement("div");
    
            colUnity.classList.add("col-unity")
            colUnity.innerText = element.unity.length > 0 ?
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
    
            list.appendChild(row)
            globalList.push(element)
        //}
    });
    
}

function getPackages(){
    const url = "https://delivery-control-bkend.herokuapp.com/get-packages"
    axios.get(url, { 
        headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        insertRowList(response.data)        
    })
    .catch(error => {
        console.log(error)
    })
}
getPackages()

function getUnities(){    
    unitiesDataList.innerHTML = ""
    
    const urlUnities = "https://delivery-control-bkend.herokuapp.com/get-unities"    
    
    axios.get(urlUnities, { headers: {"Authorization" : `Bearer ${localStorage.getItem("token")}`}})
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
            if(unity.senders.length > 0){
                //console.log(unity.senders)
                unity.senders.forEach(element => {
                    option.label += element.name + "/"
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
    const url = "https://delivery-control-bkend.herokuapp.com/deliver-package/" + package_id
    const body = {
        "dateArrival": dateArrival.value, 
        "status": "Entregue"
    }
    console.log(url)
    axios.post(url, body, { 
        headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        console.log(response)
        getPackages()
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
