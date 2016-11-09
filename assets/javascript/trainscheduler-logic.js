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

	console.log(newTrain.name);
	console.log(newTrain.destination);
	console.log(newTrain.firstTime);
	console.log(newTrain.frequency);

	alert("Train successfully added");

	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainTimeInput").val("");
	$("#frequencyInput").val("");

	return false;
});

database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var trainFirstTime = childSnapshot.val().firstTime;
	var trainFrequency = childSnapshot.val().frequency;

	console.log(trainName);
	console.log(trainDestination);
	console.log(trainFirstTime);
	console.log(trainFrequency);

	var trainFirstTimePretty = moment.unix(trainFirstTime).format("HH:mm");
	console.log("First train time is: " + trainFirstTimePretty);

	var trainNextArrival;
	var trainMinutesAway;

	var trainFirstTimeConverted = moment(trainFirstTimePretty,"HH:mm").subtract(1, "years");
	console.log(trainFirstTimeConverted);

	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	var diffTime = moment().diff(moment(trainFirstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	var trainRemainder = diffTime % trainFrequency;
	console.log(trainRemainder);

	var trainMinutesAway = trainFrequency - trainRemainder;
	console.log("MINUTES TILL TRAIN: " + trainMinutesAway);

	var trainNextArrival = moment().add(trainMinutesAway, "minutes");
	console.log("ARRIVAL TIME: " + moment(trainNextArrival).format("HH:mm"));

	var trainNextArrivalPretty = moment(trainNextArrival).format("HH:mm");

	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + trainNextArrivalPretty  + "</td><td>" + trainMinutesAway + "</td></tr>");

});
