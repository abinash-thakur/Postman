console.log("This will be included sucessfully");

//utility function to create the element and added 
function createElement(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstChild;
}

//by default apps in run parameters box aswell as json box also hide and content type also hide
let parameterbox = document.getElementById('parameterbox');
let jsonbox = document.getElementById('jsonbox');
let contentType = document.getElementById('contentType');
parameterbox.style.display = "none";
jsonbox.style.display = "none";
contentType.style.display = "none";

//if postradio is cheacked the content type is display and by default json box is display
let postradio = document.getElementById('postradio');
postradio.addEventListener('click', () => {
    contentType.style.display = "flex";
    jsonbox.style.display = "block";
})
//if getradio is cheacked the content type is display and by default json box is display
let getradio = document.getElementById('getradio');
getradio.addEventListener('click', () => {
    parameterbox.style.display = "none";
    jsonbox.style.display = "none";
    contentType.style.display = "none";
})

//if jsonradio is click parameter box is hide
let jsonradio = document.getElementById("jsonradio");
jsonradio.addEventListener('click', () => {
    jsonbox.style.display = "block";
    parameterbox.style.display = "none";
});

//if parameter radio is click jsonbox is hide
let customradio = document.getElementById('customradio');
customradio.addEventListener("click", () => {
    parameterbox.style.display = "block";
    jsonbox.style.display = "none";
});

//initiali the parameter box having 0
let numberOfParameterBox = 0;

//adding parameter box when user click the plus button
let btnAddParameter = document.getElementById("addparams");
btnAddParameter.addEventListener("click", () => {
    let string = `<div class="row">
    <label for="url" class="col-sm-2 col-form-label fs-5">Parameter${numberOfParameterBox + 2}</label>
    <div class="col">
        <input type="text" class="form-control" placeholder="Enter parameter key" id="parameterkey${numberOfParameterBox + 2}" >
    </div>
    <div class="col">
        <input type="text" class="form-control" placeholder="Enter parameter value" id="parametervalue${numberOfParameterBox + 2}">
    </div>
    <div class="col">
        <button class="btn btn-danger deletparams">Remove</button>
    </div>
</div>`;

    let element = createElement(string);
    document.getElementById('addparameterbox').appendChild(element);
    numberOfParameterBox++;

    //for deleting the custom parameters
    let deletparams = document.getElementsByClassName('deletparams');
    for (item of deletparams) {
        item.addEventListener('click', (e) => {
            e.target.parentElement.parentElement.remove();
        })
    }
})

//when the user click in json box 
let jsontext = document.getElementById('jsontext');
jsontext.addEventListener("click", () => {
    jsontext.value = "";
})

jsontext.addEventListener("blur", () => {
    if (jsontext.value == "") {
        jsontext.value = "Enter the Request JSON";
    }
})

//when the user is click into the submit button
let btnSubmit = document.getElementById('btnSubmit');
btnSubmit.addEventListener('click', () => {


    let url = document.getElementById('URL').value;

    if (url != "") {

        let requestType = document.querySelector("input[name='request type']:checked").value;
        let contentType = document.querySelector("input[name='content type']:checked").value;

        //set a text to wait for user to get the response from server
        document.getElementById('responsePrism').innerHTML = "plz wait.. we will featch the response from the server..";

        //now we store the data into data object
        if (requestType == "post") {
            if (contentType == "customParameter") {
                data = {};
                for (let i = 0; i < numberOfParameterBox + 1; i++) {
                    if (document.getElementById("parameterkey" + (i + 1)) != undefined) {
                        let parameterKey = document.getElementById("parameterkey" + (i + 1)).value;
                        let parameterValue = document.getElementById("parametervalue" + (i + 1)).value;
                        data[parameterKey] = parameterValue;
                    }
                }
            }
            else {
                data = document.getElementById('jsontext').value;
                data = JSON.parse(data);
            }
            fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then(response => response.text())
            .then((text) => {
                    document.getElementById('responsePrism').innerHTML = text;
                    Prism.highlightAll()
            })
        }
        else {
            fetch(url, {
                method: "GET",
            })
                .then(response => response.text())
                .then((text) => {
                    document.getElementById('responsePrism').innerHTML = text;
                    Prism.highlightAll()
            })
        }
    }
    else {
        let alertBox = document.getElementById('alertBox');
        alertBox.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>ALERT!</strong> pease enter the valid url
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
        setTimeout(() => {
            alertBox.innerHTML = "";
        }, 3000);
    }

});