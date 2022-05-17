function toggleLogin(){
    console.log('toggle!!!');;
}
function signup(){
    var username = document.querySelector("#UsernameInput").value;
    var password = document.querySelector("#PasswordInput").value;
    if(!username || !password){
        return;
    }

    var url = 'signup/';
    var cookie = document.cookie;
    var split = cookie.split("=");
    var token = split[1];
    var data = {'username':username, 'password':password};
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token,
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => console.log(data));
}

function login(){
    var username = document.querySelector("#UsernameInput").value;
    var password = document.querySelector("#PasswordInput").value;
    if(!username || !password){
        return;
    }

    var url = 'login/';
    var cookie = document.cookie;
    var split = cookie.split("=");
    var token = split[1];
    var data = {'username':username, 'password':password};
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token,
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => console.log(data));
}