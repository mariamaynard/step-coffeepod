class Meeting {
     constructor(id, title, when, where, description, accepted, filled) {
        this.id = id;
        this.title = title;
        this.when = when;
        this.where = where;
        this.description = description;
        this.accepted = accepted;
        this.filled = filled;
    }
}

function sendMeetingRequest(event){
    event.preventDefault();
    // get information from the form
    const meetingForm = document.getElementById("meeting-form");
    const title = meetingForm['title'].value;
    const when = new Date(meetingForm['when'].value);
    const where = meetingForm['where'].value;
    const description = meetingForm['description'].value;

    const meeting = new Meeting("", title, when, where, description, false, true);
    recordMeetingInfoAndSendNotification(meeting);

    // add confirmation on the screen

    const addConfirm = document.getElementById("add-confirm-meeting");
    addConfirm.innerText = "Your meeting request is sent! Add another meeting:";
    meetingForm.reset();  
}

function recordMeetingInfoAndSendNotification(meeting) {
    // put meeting info into meetings and auto generate an id for it

    db.collection('mentorship').doc(mentorshipID).collection('meetings').add({
        title: meeting.title,
        when: meeting.when,
        where: meeting.where,
        description: meeting.description,
        accepted: false,
        filled: true
    }).then(function(newMeetingRef) {
        const meetingId = newMeetingRef.id;
        meeting.id = meetingId;
        sendNotification(meeting);
    })
}

function sendNotification(meeting) {
    db.collection('mentorship').doc(mentorshipID).get().then(function(mentorship) {
        let personToNotifyId;
        if (currentUserIsMentor == true) {
            personToNotifyId = mentorship.data().menteeId;
        } else {
            personToNotifyId = mentorship.data().mentorId;
        }
        addNotification(personToNotifyId, meeting);
    });
    
}

// in notification, store meeting id and mentorship id

function addNotification(personId, meeting) {
    db.collection('notifications').doc(personId).update({
        meetingRequest: firebase.firestore.FieldValue.arrayUnion({mentorshipId: mentorshipID, meetingId: meeting.id})
    });
}

function showMeetingsOnPage() {
    // only show meetings that are accepted 
}

/*
 
 testFirebase();
 testDeleteFirebase();
 // add to a field that has not been instantiated
function testFirebase() {
    console.log(mentorshipID);
    db.collection('mentorship').doc(mentorshipID).collection('meetings').doc('iWe6BVc6KtP4yj0yw1Om').update({
        request: firebase.firestore.FieldValue.arrayUnion({mentorshipId: mentorshipID, meetingId: 'a4KWy8d3pjbJMMsP5NBt'})
    })
}

function testDeleteFirebase(){
    db.collection('mentorship').doc(mentorshipID).collection('meetings').doc('iWe6BVc6KtP4yj0yw1Om').update({
        request: firebase.firestore.FieldValue.arrayRemove({mentorshipId: mentorshipID, meetingId: 'a4KWy8d3pjbJMMsP5NBt'})
    })
}
*/