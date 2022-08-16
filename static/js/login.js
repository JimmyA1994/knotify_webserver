function toggleLogin(){
    console.log('toggle!!!');;
}
function signup(){
    var email = document.querySelector("#EmailInput").value;
    var password = document.querySelector("#PasswordInput").value;
    if(!email || !password){
        return;
    }

    var url = 'signup/';
    var cookie = document.cookie;
    var split = cookie.split("=");
    var token = split[1];
    var data = {'email':email, 'password':password};
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token,
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.hasOwnProperty('status') && data['status']=='good'){
            window.location.replace(window.location.protocol + '//' + window.location.host + '/');
        }
    });
    return false; // ignore form submission, we handle navigation
}

function login(){
    var email = document.querySelector("#EmailInput").value;
    var password = document.querySelector("#PasswordInput").value;
    if(!email || !password){
        return;
    }

    var url = 'login/';
    var cookie = document.cookie;
    var split = cookie.split("=");
    var token = split[1];
    var data = {'email':email, 'password':password};
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token,
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.hasOwnProperty('status') && data['status']=='good'){
            window.location.replace(window.location.protocol + '//' + window.location.host + '/');
        }
    });
    return false; // ignore form submission, we handle navigation
}

function toggleLogin(){
    var loginSpan = document.querySelector('#toggle-login-span');
    loginSpan.style = "display:none";
    var signupSpan = document.querySelector('#toggle-signup-span');
    signupSpan.style = "display:visible";

    var button = document.querySelector('#button');
    button.value = "Log in!";
    var form = document.querySelector('form');
    form.onclick = login;
    // button.onclick = login;
}

function toggleSignup(){
    var signupSpan = document.querySelector('#toggle-signup-span');
    signupSpan.style = "display:none";
    var loginSpan = document.querySelector('#toggle-login-span');
    loginSpan.style = "display:visible";

    var button = document.querySelector('#button');
    button.value = "Sign up!";
    var form = document.querySelector('form');
    form.onclick = signup;
    // button.onclick = signup;
}
