var calendarId = "qlkpvkgusn31c17rdvgf1473u0@group.calendar.google.com";


window.onload = function() {
	chrome.identity.getAuthToken({interactive: true}, function(accessToken) {
	console.log(accessToken)

chrome.tabs.getSelected(null, function (tab) {
  var url = new URL(tab.url)
  var domain = url.hostname
	console.log(tab.title)
       if(tab.title=="My Class Schedule"){
	$.ajax({
            type: "POST",
            url: "https://www.googleapis.com/calendar/v3/calendars",
            headers: {"Authorization": "Bearer " + accessToken,
		"Content-Type": "application/json"
            },
            data: JSON.stringify({"summary":"classSchedule"}),
            success: function(data){ 
				console.log(JSON.stringify(data))		

	    },
	    error: function(err){console.log(JSON.stringify(err))}
	})
		

	chrome.tabs.executeScript(null, { file: "jquery-3.3.1.js" }, function() {
    		chrome.tabs.executeScript(null, {file: "contentScript.js"});
	});
       }
	else {$('#error').append("Please go to My Class Schedule on wolverine access")
		$('#error').css('width','250px')
		$('#error').css('font-size','20px')
		$('#error').css('text-align','center')
}
   })


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

	var temp = document.createElement("button");
	temp.innerHTML = "<H2>Add all classes to your calendar</H2>"
	temp.setAttribute('id',"allClasses")
	$("#listOfEvents").append(temp)
	$("#allClasses").click(function(){
		request['information'].forEach(function(item){
			addToCalendar(item);
		})
		$("#listOfEvents").hide();
		$('body').prepend("<H2>Added all classes to your calendar</H2>")
		$('body').css('width','250px')
	})

var counter = 0;
request['information'].forEach(function(item){
	
	var temp = document.createElement("button");
	var name = item['summary'].split(' - ')
	temp.innerHTML = "<H2>" + name[0] + "</H2><p>" + name[1] + "</p>"
	temp.setAttribute('id',counter)
	$("#listOfEvents").append(temp)
	$("#"+counter).click(function(){
		addToCalendar(item);
		var heading = $(this).children('H2').text()
		var description = $(this).children('p').text()
		$(this).children('H2').hide()
		$(this).children('p').hide()
		$(this).css('background-color','#2bbce5');
		$(this).css('color','#ffffff');

		$(this).prepend("Added " + heading + " " + description + " to calendar")
	})
	++counter

})

})



var addToCalendar = function (item){
$.ajax({
            type: "POST",
            url: "https://www.googleapis.com/calendar/v3/calendars/"+calendarId+"/events",
            dataType: 'json',
            headers: {"Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(item),
            success: function(data){ 
              //document.write(JSON.stringify(data))
		console.log('Added ' + item['summary'] + ' to calendar')
		if(!item['isFirstDayIncluded']) {
		setTimeout(function(){
		 $.ajax({
            	type: "GET",
           	 url: "https://www.googleapis.com/calendar/v3/calendars/"+calendarId+"/events/" + data['id'] + "/instances",
            	headers: {"Authorization": "Bearer " + accessToken,
            	},
		success: function(data) {
			              //console.log(JSON.stringify(data))
			$.ajax({
            		type: "DELETE",
           	 	url: "https://www.googleapis.com/calendar/v3/calendars/"+calendarId+"/events/" + data['items'][0]['id'],
            		headers: {"Authorization": "Bearer " + accessToken
            		},
			success: function(data)	{
				//console.log('deleted extra event')
			},
			error: function(err) {
				console.log(err)
		console.log('Failed to add ' + item['summary'] + ' to calendar ' + err)
			},
			}) 
			
		},
		error: function(err){ 
              		console.log(JSON.stringify(err))
		console.log('Failed to add ' + item['summary'] + ' to calendar ' + err)
            	}
		
		})},1000) }
		
            },
            error: function(err){ 
              //document.write(JSON.stringify(err))
		console.log('Failed to add ' + item['summary'] + ' to calendar ' + err)
		if(err['status']==503){addToCalendar(item)}
            }
      })

}


});

 };

