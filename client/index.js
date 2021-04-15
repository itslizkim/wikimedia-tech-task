
//Global Element//
const formInputs = ["first-name", "last-name", "street-address", "city", "state-region", "country","postal-code","phone-number","email","contact-pref","donation-amount", "currency", "frequency","comment"]
/*********************************** DOM Elements ***********************************/
const donationForm = document.querySelector("#donation-form");
const confirmPage = document.querySelector('#confirmation');
const thankYouCard = document.querySelector("#thank-you-card");

/*********************************** Event Listeners ***********************************/
donationForm.addEventListener("submit", (e) => renderConfirmPage(e));

window.onclick = function(event) {
    if (event.target == thankYouCard) {
      thankYouCard.style.display = "none";
      window.location.reload();
    }
}

/*********************************** Event Handlers ***********************************/
function renderConfirmPage(e){
    e.preventDefault();

    formInputs.forEach(input => {
        const id = input.replace(/-/,'');
        this[id] = e.target[input].value;
    })
    
    if(this.comment === ''){
        this.comment = " "
    }

    let yearProjection = this.frequency === "Monthly" ? this.donationamount * 12 : this.frequency === "Just Once" ? this.donationamount * 365 : this.donationamount

    let currencySym = this.currency === "USD" ? "$" : this.currency === "Euro" ? "€" : "₿"

    confirmPage.innerHTML =`
        <div id="review-info">
            <h1> Review Information</h1>
            <fieldset>
                <h4>First Name: </h4>
                <a>${this.firstname}</a>
                <h4>Last Name: </h4>
                <a>${this.lastname}</a>
                <h4> Street Address: </h4>
                <a>${this.streetaddress}</a>
                <h4> City: </h4>
                <a>${this.city}</a>
                <h4>State/Region: </h4>
                <a>${this.stateregion}</a>
                <h4>Country: </h4>
                <a>${this.country}</a>
                <h4>Postal Code: </h4>
                <a>${this.postalcode}</a>
                <h4>Phone Number: </h4>
                <a>${this.phonenumber}</a>
                <h4>Email: </h4>
                <a>${this.email}</a>
                <h4>Contact Preference: </h4>
                <a>${this.contactpref}</a>
                <h4>Donation Amount: </h4>
                <a>${this.donationamount} ${currencySym} <b>${this.frequency}</b></a>
                <h4>Comment:</h4>
                <a>${this.comment}</a>
                <h4>Total Projected Donation For A Year: ${yearProjection} ${currencySym}</h4> 
            </fieldset>
            <button onclick="handleConfirmation()" id="confirm-btn">Confirm</button>
            <button onclick="cancel()" id"cancel-btn">Cancel</button>
        </div>
    `

    confirmPage.style.display = "block"
}

function handleConfirmation(){
    //newDonor sql table info
    const newDonor = {
        last_name : this.lastname,
        first_name : this.firstname,
        street_address : this.streetaddress,
        city : this.city,
        state_region : this.stateregion,
        country : this.country,
        postal_code : this.postalcode,
        phone_number : this.phonenumber,
        email : this.email,
        contact_pref : this.contactpref,
        donation_amount : this.donationamount,
        currency : this.currency,
        donation_freq : this.frequency,
        comment : this.comment
    }
    fetch('http://localhost:5000/donor',{
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(newDonor)
    })
    .then(response => response.json())
    .then(data => renderDonorThanksCard(data))

    confirmPage.style.display = "none";
    thankYouCard.style.display = "block"

}

function renderDonorThanksCard(data){
    
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const firstN = capitalize(data.first_name);
    const lastN = capitalize(data.last_name);

    thankYouCard.innerHTML=`
    <div id="message">
        <span class="close">&times;</span>
        <h1>Thank You ${firstN} ${lastN} for your donation!</h1>
        <p>Someone from the Wikimedia Foundation will get in touch with you soon!</p>   
    </div>
    `
    const span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        thankYouCard.style.display = "none";
        window.location.reload();
    }
}

function cancel(){
    confirmPage.innerHTML =`
        <div id="review-info">
            <h1>Thank you for your consideration.</h1>
            <a href="index.html"> start over </a>
        </div>
    `

}

/*********************************** Initial Render ***********************************/
fetch('http://localhost:5000/')
.then(response => response.json())
.then(data => console.log(data))
