NetworkTables.addRobotConnectionListener(onRobotConnection, true);
NetworkTables.addGlobalListener(onValueChanged, true);

var time = [];
var speed = [];

function onRobotConnection(connected) {
	var state = connected ? 'Connected' : 'Disconnected';
	console.log(state);
	$('#robot-state').text(state);
	if (connected) {
		$('#robot-state').addClass("connected");
	} else {
		$('#robot-state').removeClass("connected");
	}
}

function onValueChanged(key, value, isNew) {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// Log value changes
	console.log(key + " | " + value);

	switch (key) {
		case '/SmartDashboard/time_running':
			// When this NetworkTables variable is true, the timer will start.
			var s = 135;
			if (value) {
				// Make sure timer is reset to black when it starts
				$("#timer").css(color, 'black');
				var countdown = setInterval(function() {
					s--;
					var m = Math.floor(s / 60);
					var visualS = (s % 60);

					visualS = visualS < 10 ? '0' + visualS : visualS;

					if (s < 0) {
						clearTimeout(countdown);
						return;
					} else if (s <= 15) {
						$("#timer").css(color, (s % 2 === 0) ? '#FF3030' : 'transparent');
					} else if (s <= 30) {
						$("#timer").css(color, '#FF3030');
					}
					$("#timer").innerHTML = m + ':' + visualS;
				}, 1000);
			} else {
				s = 135;
			}
			NetworkTables.setValue(key, false);
			break;
		case '/SmartDashboard/LeftEnc':
			speed.push(value);
			break;
		case '/SmartDashboard/Holder':
			if (value) {
				$('#holder').addClass('on');
			} else {
				$('#holder').removeClass('on');
			}
			break;
		case '/SmartDashboard/StartPos':
			if (value == 0) {
				$('#auton-ready').addClass('on');
			} else {
				$('#auton-ready').removeClass('on');
			}
			break;
	}
}

var speedChart = new Chart($("#speed"), {
	type: 'line',
	data: {
		labels: time,
		datasets: [{
			label: 'Speed',
			data: speed,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)'
			],
			borderColor: [
				'rgba(255,99,132,1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)'
			],
			borderWidth: 1
		}]
	},
	options: {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero:true
				}
			}]
		}
	}
});
