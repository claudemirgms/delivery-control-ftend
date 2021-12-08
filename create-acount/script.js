// page create-acount
const email = document.querySelector("#email"),
password = document.querySelector("#password"),
confirmPw = document.querySelector("#confirmPw"),
showPassword = document.querySelector(".show"),
alertIconCreate = document.querySelector(".errorIconCreate"),
alertTextCreate = document.querySelector(".textCreate"),
alertIconEmail = document.querySelector(".errorIconEmail"),
alertTextEmail = document.querySelector(".textEmail"),
submitBtnCreate = document.querySelector("#btnCreate");

let formValidated = false;
let validatedEmail = false
let validatedPassword = false

email.addEventListener("change", () => {
    emailValidation()
    formValidation()
})

password.addEventListener("input", () => {
    let inputValue = password.value.trim();

    if(inputValue.length >= 5){
        confirmPw.removeAttribute("disabled");
    }
    else{
        confirmPw.setAttribute("disable", true);        
        confirmPw.value = ""
        alertTextCreate.innerText = "Minimo 6 caracteres"
        alertTextCreate.style.color = "#a6a6a6"
        alertIconCreate.style.display = "none"
    }
});

showPassword.addEventListener("click", () => {
    if((password.type === "password") && (confirmPw.type === "password")){
        password.type = "text"
        confirmPw.type = "text"
        showPassword.classList.replace("fa-eye-slash", "fa-eye");
    }
    else{
        password.type = "password"
        confirmPw.type = "password"
        showPassword.classList.replace("fa-eye", "fa-eye-slash");
    }
});

password.addEventListener("change", () => {
    formValidation()
})

submitBtnCreate.addEventListener("click", () => {
    createUser()    
});

confirmPw.addEventListener("change", () => {
    passwordValidation()
    formValidation()
})

function emailValidation(){
    var re = /\S+@\S+\.\S+/;        
    if(re.test(email.value)){                
        alertIconEmail.style.display = "none"
        alertTextEmail.style.display = "none";    
        validatedEmail = true
    }
    else{
        confirmPw.setAttribute("disable", true);
        submitBtnCreate.setAttribute("disabled", true);
        submitBtnCreate.classList.remove("active");
        alertTextEmail.innerText = "E-mail inválido"
        alertTextEmail.style.color = "#D93025";
        alertTextEmail.style.display = "block";    
        alertIconEmail.style.display = "block";    
        validatedEmail = false
    }
}

function passwordValidation(){
    if(password.value === confirmPw.value){        
        alertTextCreate.innerText = "Minimo 6 caracteres"
        alertTextCreate.style.color = "#a6a6a6"
        alertIconCreate.style.display = "none"  
        validatedPassword = true
    }
    else{
        submitBtnCreate.setAttribute("disabled", true);
        submitBtnCreate.classList.remove("active");
        alertTextCreate.innerText = "Senha não são iguais"
        alertTextCreate.style.color = "#D93025"
        alertIconCreate.style.display = "block"
        validatedPassword = false
    }
}

function formValidation(){
    console.log("validatedEmail: " + validatedEmail)
    console.log("validatedPassword: " + validatedPassword)
    if(validatedEmail && validatedPassword){                
        submitBtnCreate.removeAttribute("disabled");
        submitBtnCreate.classList.add("active");                
    }
    else{
        submitBtnCreate.setAttribute("disabled", true);
        submitBtnCreate.classList.remove("active");        
    }
}

function createUser(){    
    console.log("inicio")
    const urlCreateUser = "http://localhost:3333/create-user"
    console.log(urlCreateUser)
    const body = {
        "email": email.value,
	    "password": password.value,
        "type": "user"
    }
    
    axios.post(urlCreateUser, body)
    .then(response => {
        console.log(response)        
        if(!response.data.error){
            alertTextCreate.style.color = "#4070F4";
            alertIconCreate.style.display = "none";  
            window.location.href = "../login/"          
        }
        else{
            console.log(response.data.error)
            alertTextCreate.innerText = response.data.error;
            alertTextCreate.style.color = "#D93025";
            alertIconCreate.style.display = "block";    
        }                    
    })
    .catch(error => {
        console.log(error)
        alertText.innerText = error;
        alertText.style.color = "#D93025";
        alertIcon.style.display = "block";
    })
}

