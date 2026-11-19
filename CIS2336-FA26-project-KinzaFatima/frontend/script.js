const menuItems = [
    { text: "Home", link: "index.html" },
    { text: "About", link: "about.html" },
    { text: "Dining", link: "dining.html" },
    { text: "Activities", link: "activities.html" },
    { text: "Events", link: "event.html" },
    { text: "Booking", link: "booking.html" },
    { text: "Contact", link: "contact.html" }
];

function buildMenu() {
    const nav = document.getElementById("main-nav");
    if (nav === null) {
        return;   
    }

    let currentPage = location.pathname.split("/").pop();
    if (currentPage === "") {
        currentPage = "index.html";
    }

    let html = '<a class="logo" href="index.html">';
    html += '<img src="uhlogo.png"></a>';

    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        if (item.link === currentPage) {
            html += '<a class="active" href="' + item.link + '">' + item.text + '</a>';
        } else {
            html += '<a href="' + item.link + '">' + item.text + '</a>';
        }
    }

    nav.innerHTML = html;
}

buildMenu();

const fieldIds = ["room", "fullname", "email", "club", "date", "time", "headcount"];


const roomCapacity = {
    "Study Room 101": 4,
    "Study Room 102": 4,
    "Study Room 103": 6,
    "Game Room": 20,
    "Multipurpose Hall": 50
};

function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

function showError(id, message) {
    document.getElementById(id + "-error").textContent = message;
    document.getElementById(id).classList.add("invalid");
}


function clearErrors() {
    for (let i = 0; i < fieldIds.length; i++) {
        const id = fieldIds[i];
        document.getElementById(id + "-error").textContent = "";
        document.getElementById(id).classList.remove("invalid");
    }
    document.getElementById("booking-result").textContent = "";
    document.getElementById("booking-result").className = "";
}


function isRoomAvailable(room, date, time) {
    return true;
}

function checkBookingForm(event) {
    event.preventDefault();     
    clearErrors();

    const room = document.getElementById("room").value;
    const name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const club = document.getElementById("club").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const headcount = Number(document.getElementById("headcount").value);
    const bookingType = document.querySelector('input[name="type"]:checked').value;

    let isValid = true;

    if (room === "") {
        showError("room", "Please choose a room.");
        isValid = false;
    }

    if (name.length < 2) {
        showError("fullname", "Please enter your full name.");
        isValid = false;
    }

    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
    }

    if (bookingType === "club" && club === "") {
        showError("club", "Please enter your club or organization.");
        isValid = false;
    }

    if (date === "") {
        showError("date", "Please pick a date.");
        isValid = false;
    } else if (date < getToday()) {
        showError("date", "The date can't be in the past.");
        isValid = false;
    }

    if (time === "") {
        showError("time", "Please pick a start time.");
        isValid = false;
    } else if (time < "07:00" || time > "21:00") {
        showError("time", "Bookings are from 7:00 AM to 9:00 PM.");
        isValid = false;
    }

    if (headcount < 1) {
        showError("headcount", "Enter how many people (at least 1).");
        isValid = false;
    } else if (room !== "" && headcount > roomCapacity[room]) {
        showError("headcount", room + " holds up to " + roomCapacity[room] + " people.");
        isValid = false;
    }

    if (isValid === false) {
        return;
    }

  
    if (isRoomAvailable(room, date, time) === false) {
        document.getElementById("booking-result").className = "error-box";
        document.getElementById("booking-result").textContent = room + " is already booked then. Try another time.";
        return;
    }

    document.getElementById("booking-result").className = "success";
    document.getElementById("booking-result").textContent ="Thanks, " + name + "! Your request for " + room + " on " + date + " at " + time + " was submitted.";
    document.getElementById("booking-form").reset();
}

const bookingForm = document.getElementById("booking-form");
if (bookingForm !== null) {
    document.getElementById("date").min = getToday();   
    bookingForm.addEventListener("submit", checkBookingForm);
}