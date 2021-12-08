// page index
const email = document.querySelector('#email'),
password = document.querySelector("#password"),
showPassword = document.querySelector(".show"),
alertIcon = document.querySelector(".alertIcon"),
alertText = document.querySelector(".alertText"),
submitBtnLogin = document.querySelector('#btnLogin');

showPassword.addEventListener("click", () => {
    if(password.type === "password"){
        password.type = "text"
        showPassword.classList.replace("fa-eye-slash", "fa-eye");
    }
    else{
        password.type = "password"
        showPassword.classList.replace("fa-eye", "fa-eye-slash");
    }
});

submitBtnLogin.addEventListener("click", () => {
    if(email.value == "") {
        alertTextLogin.innerText = "Informe seu e-mail"
        alertTextLogin.style.color = "#D93025"
        alertIconLogin.style.display = "block"
        return
    } 
    if(password.value == ""){
        alertTextLogin.innerText = "Informe sua senha"
        alertTextLogin.style.color = "#D93025"
        alertIconLogin.style.display = "block"
        return
    }
    getSession()
});

function getSession(){
    const urlSession = "https://delivery-control-bkend.herokuapp.com/get-session"
    
    const body = {
        "email": email.value,
	    "password": password.value
    }
    
    axios.post(urlSession, body)
    .then(response => {
        if(response.status == 200){
            const data = response.data;

            const token = document.querySelector("#token")
            token.value = data.token
            console.log(token.value)
            
            alertText.innerText = "Password Ok";
            alertText.style.color = "#4070F4";
            alertIcon.style.display = "none";
            
            if(data.user.email === "admin"){                
                window.location.href = "../dashboard/index.html?" + "token=" + token.value
            }
        }                    
    })
    .catch(error => {
        alertText.innerText = "Password NOk";
        alertText.style.color = "#D93025";
        alertIcon.style.display = "block";
    })
}

password.addEventListener("keyup", function(event) {
    enterClick(event)
});
  
function enterClick(event){
    if (event.keyCode === 13) {
        event.preventDefault();
        submitBtnLogin.click();    
    }
}
