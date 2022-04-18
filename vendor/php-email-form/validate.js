/**
* PHP Email Form Validation - v3.2
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                // php_email_form_submit(thisForm, action, formData);
                js_email_form_submit();
              })
            } catch(error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        // php_email_form_submit(thisForm, action, formData);
        js_email_form_submit();
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if( response.ok ) {
        return response.text()
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.trim() == 'OK') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function js_email_form_submit(thisForm){
    
    let body = "From: " + document.getElementById("name").value + "\n";
    body += "Email: " + document.getElementById("email").value + "\n";
    body += "Message: " + document.getElementById("message").value + "\n";
  
    let request = {
      "toEmail": "bkrentalsde@gmail.com",
      "subject": document.getElementById("subject").value,
      "body": body
    }

    fetch("https://fellas-rest.herokuapp.com/api/email", {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {'Content-Type': 'application/json'}
      
    })
    .then(response => {
      if( response.ok ) {
        return "OK"
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      document.querySelector('.loading').classList.remove('d-block');
      if (data.trim() == 'OK') {
        document.querySelector('.sent-message').classList.add('d-block');
        reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  
    console.log(request);
  }

  function displayError(thisForm, error) {
    document.querySelector('.loading').classList.remove('d-block');
    document.querySelector('.error-message').innerHTML = error;
    document.querySelector('.error-message').classList.add('d-block');
  }

  function reset(){
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
    document.getElementById("subject").value = "";
  }

})();
