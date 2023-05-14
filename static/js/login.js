function signup(){
    var email = document.querySelector("#EmailInput").value;
    var password = document.querySelector("#PasswordInput").value;
    const regex = /[\w\d_+.-]+@[\w]+[.][A-Za-z]+/g
    const regex_match = email.match(regex)
    const is_valid_email = regex_match && regex_match.length == 1 && regex_match[0] == email
    if(!email || !password || !is_valid_email){
        return false;
    }

    var url = '';
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
        if(data.hasOwnProperty('status') && data['status']=='OK'){
           goToHome();
        }else {
            var msg;
            if (data['reason'] == 'invalid_email') {
                return false; // let bootstrap validation handle it
            }
            else if (data['reason'] == 'user_could_not_be_created') {
                msg = "User could not be created.";
            }
            else {
                msg = "Something went wrong."
            }
            const error_msg = document.querySelector("#error-msg");
            error_msg.innerHTML = msg;
            const error_alert = document.querySelector("#error-alert");
            error_alert.classList.remove('d-none');
            return false;
        }
    })
    .catch(error => {
        const error_msg = document.querySelector("#error-msg");
        error_msg.innerHTML = "Something went wrong.";
        const error_alert = document.querySelector("#error-alert");
        error_alert.classList.remove('d-none');
    });
    return false; // ignore form submission, we handle navigation
}

function login(){
    var email = document.querySelector("#EmailInput").value;
    var password = document.querySelector("#PasswordInput").value;
    const regex = /[\w\d_+.-]+@[\w]+[.][A-Za-z]+/g
    const regex_match = email.match(regex)
    const is_valid_email = regex_match && regex_match.length == 1 && regex_match[0] == email
    if(!email || !password || !is_valid_email){
        return false;
    }

    var url = '';
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
        if(data.hasOwnProperty('status') && data['status']=='OK'){
            goToHome();
        }else {
            var msg;
            if (data['reason'] == 'invalid_email') {
                return; // let bootstrap validation handle it
            }
            else if (data['reason'] == 'user_not_found') {
                msg = "User was not found.";
            }
            else {
                msg = "Something went wrong."
            }
            const error_msg = document.querySelector("#error-msg");
            error_msg.innerHTML = msg;
            const error_alert = document.querySelector("#error-alert");
            error_alert.classList.remove('d-none');
            return false;
        }
    })
    .catch(error => {
        const error_msg = document.querySelector("#error-msg");
        error_msg.innerHTML = "Something went wrong.";
        const error_alert = document.querySelector("#error-alert");
        error_alert.classList.remove('d-none');
    });
    return false; // ignore form submission, we handle navigation
}

function toggleLogin(){
    window.location.replace(window.location.protocol + '//' + window.location.host + '/login/');
}

function toggleSignup(){
    window.location.replace(window.location.protocol + '//' + window.location.host + '/signup/');
}

function goToHome(){
    window.location.replace(window.location.protocol + '//' + window.location.host + '/');
}
