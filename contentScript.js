var details = [];

var counter = 0;
var i = 0;

while($('#ptifrmtgtframe').contents().find('#win0divDERIVED_REGFRM1_DESCR20\\$'+counter).html() != undefined) {

var className = $('#ptifrmtgtframe').contents().find('#win0divDERIVED_REGFRM1_DESCR20\\$'+ counter + ' td.PAGROUPDIVIDER').text()

/*details.push({
"class name": $('#ptifrmtgtframe').contents().find('#win0divDERIVED_REGFRM1_DESCR20\\$'+ counter + ' td.PAGROUPDIVIDER').text(),
"info":[
]
})*/

while($('#ptifrmtgtframe').contents().find('#win0divDERIVED_REGFRM1_DESCR20\\$'+counter+' #win0divMTG_SCHED\\$'+i).length==1) {
	var name = $('#ptifrmtgtframe').contents().find('#win0divMTG_COMP\\$'+i).text();
	if(name.length == 2){name = $('#ptifrmtgtframe').contents().find('#win0divMTG_COMP\\$'+(i-1)).text()}
    
    var dayTime = ($('#ptifrmtgtframe').contents().find('#win0divMTG_SCHED\\$'+i).text()).split(" ")

    var startTimeTemp = dayTime[1].split(':');
    if(startTimeTemp[1][2]=="P" && startTimeTemp[0] != '12'){startTimeTemp[0] = parseInt(startTimeTemp[0])+12}
    var startTime = startTimeTemp[0]+':'+startTimeTemp[1].slice(0,-2) + ':00';

    var endTimeTemp = (dayTime[3].replace('\n','')).split(':');
    if(endTimeTemp[1][2]=="P" && endTimeTemp[0] != '12'){endTimeTemp[0] = parseInt(endTimeTemp[0])+12}
    var endTime = endTimeTemp[0]+':'+endTimeTemp[1].slice(0,-2) + ':00';
	

    var startEndDate = ($('#ptifrmtgtframe').contents().find('#win0divMTG_DATES\\$'+i).text()).split(" ")

    var startDateTemp = startEndDate[0].split('/');
    var startDate = startDateTemp[2]+'-'+startDateTemp[0] + '-' + startDateTemp[1];
    startDate.replace(' ', '')

    var endDateTemp = startEndDate[2].split('/');
    var endDate = endDateTemp[2].replace('\n','')+endDateTemp[0].replace(' ','')+endDateTemp[1];
    endDate.replace('\n', '')

        

    var daysofWeek = dayTime[0].replace('o','O,');
    daysofWeek = daysofWeek.replace('u','U,');
    daysofWeek = daysofWeek.replace('e','E,');
    daysofWeek = daysofWeek.replace('h','H,');
    daysofWeek = daysofWeek.replace('r','R,');
    daysofWeek = daysofWeek.replace('a','A,');
    daysofWeek = daysofWeek.replace('u','U,');

	var isFirstDayIncluded = true;

	var daysofWeekList = ['SU','MO','TU','WE','TH','FR','SA',]
	var givenDay = new Date(startDate)
	if(daysofWeek.indexOf(daysofWeekList[givenDay.getDay()])== -1){
		isFirstDayIncluded = false;
	}

   details/*[counter]['info']*/.push(
    {"summary": className + " " + name,
    "recurrence": ["RRULE:FREQ=WEEKLY;UNTIL="+endDate+"T235959Z;BYDAY="+daysofWeek.slice(0,-1)],
	  "description":  $('#ptifrmtgtframe').contents().find('#win0divMTG_LOC\\$'+i).text(),
    'start': {
        'dateTime': startDate+'T'+startTime,
        'timeZone': 'America/Detroit'
      },
      'end': {
        'dateTime': startDate+'T'+endTime,
        'timeZone': 'America/Detroit'
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10}
        ]
      },
	'colorId': (counter+1).toString(), 
	'isFirstDayIncluded': isFirstDayIncluded,
	})
	++i
}

++counter;
}

chrome.runtime.sendMessage({information:details}, function(response) {

});
