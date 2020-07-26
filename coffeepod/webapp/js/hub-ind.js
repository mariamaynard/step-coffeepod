const queryStringHubInd = window.location.search;
const urlParamsHubInd = new URLSearchParams(queryStringHubInd);
const currentUserIsMentor = urlParamsHubInd.get('currentIsMentor');
const mentorshipID = getMentorshipId();



// WELCOME SECTION

function loadData() {
    getGoalCards();
    addOpeningContent();
    addOverview();
    console.log("Current user is mentor: " + currentUserIsMentor);
}

function getMentorshipId(){
    return urlParamsHubInd.get('mentorshipId');
}

function addOpeningContent() {
    const hubTitle = document.getElementById("subpage-title");

    db.collection('mentorship').doc(mentorshipID).get().then(function (mentorshipDoc) {
        const mentorId = mentorshipDoc.data().mentorId;
        const menteeId = mentorshipDoc.data().menteeId;
        
        // Get name and title of mentors and mentees
        db.collection('profile').doc(mentorId).get().then(function (profileDoc) {
            mentorName = profileDoc.data().name;
            mentorTitle = profileDoc.data().title;

            // Fill in the mentor's information
            hubTitle.querySelector("#mentor-name").innerText = mentorName;
            document.getElementById("mentor-card-name").innerText = mentorName;
            document.getElementById("mentor-card-title").innerText= mentorTitle;
        });

        db.collection('profile').doc(menteeId).get().then(function (profileDoc) {
            menteeName = profileDoc.data().name;
            menteeTitle = profileDoc.data().title;

            // Fill in the mentee's information
            hubTitle.querySelector("#mentee-name").innerText = menteeName;
            document.getElementById("mentee-card-name").innerText = menteeName;
            document.getElementById("mentee-card-title").innerText = menteeTitle;
        });

    });

}


// OVERVIEW SECTION
function addOverview() {
    addNumGoalCards();
    addTimeStart();
}

function addTimeStart() {
    const timeStart = urlParamsHubInd.get('timeMilli');
    document.getElementById("start-time").innerText = fromMillisecondsToMonthAndYear(timeStart);
}


function fromMillisecondsToMonthAndYear(milliseconds) {
    const date = new Date(parseInt(milliseconds));
    return date.toLocaleString('default', { month: 'long'}) + " " + date.getFullYear();
}

