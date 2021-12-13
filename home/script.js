//const urlApi = "http://localhost:3333"
const urlApi = "https://delivery-control-bkend.herokuapp.com"
const unity_id = sessionStorage.getItem("unity_id")
let list = document.querySelector(".list")
let btn = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");

btn.onclick = function() {
    sidebar.classList.toggle("active")
    console.log(sidebar)
}

function insertRowList(data){   
    list.innerHTML = ""
    data.forEach(element => {
        insertRow(element)        
    });
    
}

function insertRow(element){
    const row = document.createElement("div")
    row.classList.add("row")
    const colCompany = document.createElement("div"),
    colUnity = document.createElement("div"),
    colPackageCod = document.createElement("div"),
    colDate = document.createElement("div"),
    colStatus  = document.createElement("div");

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

    list.appendChild(row)
}

function getUnityPackages(){    
    const url = `${urlApi}/get-unity-packages/${unity_id}`
    console.log(url)
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
        console.log(response.data)
        insertRowList(response.data)        
    })
    .catch(error => {
        console.log(error)
    })
}
getUnityPackages()