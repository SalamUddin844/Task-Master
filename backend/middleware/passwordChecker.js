function checkPasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if(password.length < minLength){
        return {valid : false, message : "password must be at least 8 characters long!!"};
    }
    else if(!hasUpperCase){
        return {valid : false, message : "password must have at least one uppercase latter!!"};
    }
    else if(!hasLowerCase){
        return {valid : false,message  : "password must have at least one lowercase latter!!"};
    }
    else if(!hasDigit){
        return {valid : false , message :"password must have at least one digit!!"}
    }
    else if(!hasSpecialChar){
        return {valid : false ,message : "password must have at least one spacial character!!"};
    }
    return {valid :true, message : "Strong password!!"};
}

module.exports = {checkPasswordStrength};
