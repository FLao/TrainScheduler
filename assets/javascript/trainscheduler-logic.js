var config = {
    apiKey: "AIzaSyB0wwhq_TXkWIvh_y6RMWYeX-ce9TvKepI",
    authDomain: "trainscheduler-d7c6a.firebaseapp.com",
    databaseURL: "https://trainscheduler-d7c6a.firebaseio.com",
    storageBucket: "trainscheduler-d7c6a.appspot.com",
    messagingSenderId: "421155808387"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#addTrainBtn").on("click", function(){

	var trainName = $("#trainNameInput").val().trim();
	var trainDestination = $("#destinationInput").val().trim();
	var trainFirstTime = moment($("#firstTrainTimeInput").val().trim(), "HH:mm").format("X");
	var trainFrequency = $("#frequencyInput").val().trim();

	var newTrain = {
		name: trainName,
		destination: trainDestination,
		firstTime: trainFirstTime,
		frequency: trainFrequency
	}

	database.ref().push(newTrain);

	alert("Train successfully added");

	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainTimeInput").val("");
	$("#frequencyInput").val("");

	return false;
});

database.ref().on("child_added", function(childSnapshot, prevChildKey){

	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var trainFirstTime = childSnapshot.val().firstTime;
	var trainFrequency = childSnapshot.val().frequency;

	var trainFirstTimePretty = moment.unix(trainFirstTime).format("hh:mm a");

	var trainNextArrival;
	var trainMinutesAway;

	var trainFirstTimeConverted = moment(trainFirstTimePretty,"hh:mm a").subtract(1, "years");

	var currentTime = moment();

	var diffTime = moment().diff(moment(trainFirstTimeConverted), "minutes");

	var trainRemainder = diffTime % trainFrequency;

	var trainMinutesAway = trainFrequency - trainRemainder;

	var trainNextArrival = moment().add(trainMinutesAway, "minutes");

	var trainNextArrivalPretty = moment(trainNextArrival).format("hh:mm a");

	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + trainNextArrivalPretty  + "</td><td>" + trainMinutesAway + "</td></tr>");

});
