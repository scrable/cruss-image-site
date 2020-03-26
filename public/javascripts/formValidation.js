/*
    Function to validate username. It requires that the input has at least 3 characters.
    This function is used to validate login as well as registration.
 */
validateUser = (string) => {
    if(string.length < 3){
        window.alert("Username must be 3 or more alphanumeric characters.");
        string.focus();
        return false;
    }
};

validateInput = (string, obj) => {
    if(string === ''){
        window.alert("Please enter a " + obj);
        string.focus();
        return false;
    }
};

/*
    Function that validates the login of the new user.
    It requires the user to input a username with at least 3 characters and it also
    requires to input a password of at least 8 characters.
 */
validateLogin = () => {
    let input = document.forms["login"]["username"].value;
    let psw = document.forms["login"]["password"].value;

    validateUser(input);

    if(psw.length < 8) {
        window.alert("Password must be at least 8 characters long.");
        psw.focus();
        return false;
    }

    var myJSON = JSON.stringify(input);
    console.log(myJSON);
};

/*
    This function validates the registration of a new user.
    It requires the user to input a username that is 3 or more characters long;
    it requires that password has at least 8 chars and that is contains one uppercase letter,
    one number and one special character. This is verified by using regex.
    It also verifies that the user confirms the password correctly.
 */
validateRegistration = () => {
    let input = document.forms["registration"]["username"].value;
    let psw = document.forms["registration"]["inputpsw"].value;
    let confirmpsw = document.forms["registration"]["inputcpsw"].value;
    var regex = /^(?=.*[0-9])(?=.*[*!@#$^&])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    validateUser(input);

    if(!regex.test(psw)){
        alert("Password must be at least 8 characters long, contain at least one number, one uppercase and one special character");
        psw.focus();
        return false;
    }

    if (psw !== confirmpsw) {
        alert ("Passwords did not match. Please try again.");
        return false;
    }

    let myJSON = JSON.stringify(input);
    console.log(myJSON);
};

/*
    This function validates when a registered user posts an image.
    It requires the user to enter text for the title and for the description;
    it also requires to only upload images that are jpg, png, bmp, gif
 */

validatePost = () => {
    let post_title = document.forms["postImage"]["title"].value;
    let post_description = document.forms["postImage"]["description"].value;
    let ele1 = "title";
    let ele2 = "description";
    let image_file = document.getElementById('img');
    let path = image_file.value;
    let extensions = /(\.jpg|\.jpeg|\.png|\.bmp|\.gif)$/i;

    validateInput(post_title, ele1);
    validateInput(post_description, ele2);

    if(!extensions.exec(path)){
        alert("Not a valid image. Please upload images that are either jpg, png, bmp or gif");
        return false;
    }

    let myJSON = JSON.stringify(path);
    console.log(myJSON);
    };