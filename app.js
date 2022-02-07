
// function checkform() {
//     let username = document.getElementById("username");
//     let email = document.getElementById("email").value;
//     let password = document.getElementById("password");
//     let phone = document.getElementById("phone");
//     let city = document.getElementById("city");
//     let gender = document.getElementById("gender");
//     // let profile = document.getElementById("profile");

//     if (username.value.length === 0) {
//         alert("Please enter your last name");
//         return false;
//     }
//     var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\. \-]+\.[a-zA-z0-9]{2,4}$/;
//     if (!(email.match(regex))) {
//         alert("Please correct email address");
//         return false;

//     }
//     if (password.value.length <= 8) {
//         alert("Please enter 8 character");
//         return false;
//     }
//     if (phone.value.length <= 11) {
//         alert("Please enter 11 digit complete no");
//         return false;
//     }
//     if (city.value.length === 0) {
//         alert("Please enter city name");
//         return false;
//     }

//     for (var i = 0; i < gender.length; i++) {
//         if (gender[i].checked) {
//             return true;
//         }
//     }
//     alert("Please check one.");
//     return false;

// }


let uploadFiles = (file) => {
    return new Promise((resolve, reject) => {
        let storageRef = firebase.storage().ref(`myfolder/profileImages/${file.name}`);
        let progress1 = document.getElementById("progress");
        let bar = document.getElementById("bar");
        progress1.style.display = "block"
        let uploading = storageRef.put(file)
        uploading.on('state_changed',
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                bar.style.width = Math.round(progress.toFixed()) + "%";
                bar.innerHTML = Math.round(progress.toFixed()) + "%";
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                uploading.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );
    })
}



// --------------------------------------------user sign up ------------------------------------

let userRegister = async () => {
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let phone = document.getElementById("phone");
    let city = document.getElementById("city");
    let gender = document.getElementById("gender");
    let profile = document.getElementById("profile");
    let loader = document.getElementById('loader');
    let loaderText = document.getElementById('loaderText');
    let image = await uploadFiles(profile.files[0]);
    loaderText.style.display = "none";
    loader.style.display = "block"
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((res) => {
            firebase.database().ref(`users/${res.user.uid}`).set({
                username: username.value,
                email: email.value,
                password: password.value,
                phone: phone.value,
                city: city.value,
                gender: gender.value,
                profile: image
            })
                .then(() => {
                    let succesDiv = document.getElementById('succesDiv');
                    succesDiv.innerHTML = swal("Yeeh!", "You are Register!", "success");
                    succesDiv.style.display = 'block'
                    username.value = "";
                    email.value = "";
                    password.value = "";
                    phone.value = "";
                    city.value = "";


                    errorDiv.style.display = "none"
                    loaderText.style.display = "block";
                    loader.style.display = "none"
                    setTimeout(() => {
                        window.location = "../login/login.html"
                    }, 1000)
                })
        })
        .catch((err) => {
            let errorDiv = document.getElementById("errorDiv");
            errorDiv.innerHTML = swal(err.message);
            errorDiv.style.display = "block"
            loaderText.style.display = "block";
            loader.style.display = "none"

        })
}


// --------------------------------------end code user sign up----------------------------------
// -----------------------------------user login code --------------------------------------------

let login = () => {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let loader = document.getElementById('loader');
    let loaderText = document.getElementById('loaderText');
    loaderText.style.display = "none";
    loader.style.display = "block"
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((res) => {
            let succesDiv = document.getElementById('succesDiv');
            succesDiv.innerHTML = swal("Yeeh!", "You are LogIn!", "success");
            succesDiv.style.display = 'block'
            email.value = "";
            password.value = ""
            errorDiv.style.display = "none"
            loaderText.style.display = "block";
            loader.style.display = "none"
            setTimeout(() => {
                window.location = "../profile/profile.html"
            }, 1000)
        })
        .catch((err) => {
            let errorDiv = document.getElementById("errorDiv");
            errorDiv.innerHTML = swal(err.message);
            errorDiv.style.display = "block"
            loaderText.style.display = "block";
            loader.style.display = "none"
        })

}

// ------------------------------------------user login code end---------------------------------


