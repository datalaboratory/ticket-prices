helper = {
	colors: [],
	citynames: {Simferopol: "Симферополь", Berlin: "Берлин", Tivat: "Тиват"},
	monthLengths: [31,28,31,30,31,30,31,31,30,31,30,31],
	monthLenthsCumulative: [],
	monthNamesRu: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
	monthNamesRuR: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
	monthNamesRuShort: ['янв','фев','март','апр','май','июнь','июль','авг','сен','окт','ноя','дек'],
	setCumulativeDates: function(){
		var sum = 0;
		cumulative = [0];

		this.monthLengths.forEach(function(d){
			sum += d;
			cumulative.push(sum)
		})

		this.monthLenthsCumulative = cumulative;
	},
	getDayNum: function(dateString){
		year = Number(dateString.substr(0,dateString.indexOf('-')));
		dateString = dateString.substr(dateString.indexOf('-')+1,1000);
		month = Number(dateString.substr(0,dateString.indexOf('-')));
		day = Number(dateString.substr(dateString.indexOf('-')+1,1000));

		return this.monthLenthsCumulative[month-1] + day;
	},
	decomposeDate: function(date){
		y = +date.substr(0,date.indexOf('-'));
		m = +date.substr(date.indexOf('-')+1,1000).substr(0,date.indexOf('-')-2);
		d = +date.substr(date.indexOf('-')+1,1000).substr(date.indexOf('-')-1,1000);

		return {y:y,m:m,d:d};
	},
	compareDates: function(date1,date2){
		y1 = +date1.substr(0,date1.indexOf('-'));
		date1 = date1.substr(date1.indexOf('-')+1,1000);
		m1 = +date1.substr(0,date1.indexOf('-'));
		d1 = +date1.substr(date1.indexOf('-')+1,1000);

		y2 = +date2.substr(0,date2.indexOf('-'));
		date2 = date2.substr(date2.indexOf('-')+1,1000);
		m2 = +date2.substr(0,date2.indexOf('-'));
		d2 = +date2.substr(date2.indexOf('-')+1,1000);

		if(y1 > y2){
			return 1;
		} else if (y1==y2 && m1>m2) {
			return 1;
		} else if(y1==y2 && m1==m2 && d1>d2) {
			return 1;
		} else if(y1 < y2) {
			return -1;
		} else if(y1==y2 && m1<m2) {
			return -1;
		} else if(y1==y2 && m1==m2 && d1<d2) {
			return -1;
		} else {
			return 0;
		}
	},
	getDaysCount: function(date1, date2){
		days = 0;
		dayN1 = this.getDayNum(date1);
		dayN2 = this.getDayNum(date2);

		y1 = +date1.substr(0,date1.indexOf('-'));
		y2 = +date2.substr(0,date2.indexOf('-'));

		if(y2>y1){
			return (y2-y1-1)*365 + dayN2 + (365-dayN1);
		} else if(y1>y2){
			return (y1-y2-1)*365 + dayN1 + (365-dayN2);
		} else {
			return Math.abs(dayN1-dayN2);
		}

		return days;
	},
	shiftBefore: function(date,shift){
		date = this.decomposeDate(date);
		//console.log("shifting date", date, shift)

		if(shift>=date.d){
			stop = false;
			while(!stop){
				if(shift-date.d>=0) {
					shift = shift-date.d;
					date.m--;
					if(date.m<1) {
						date.m=11;
						date.y--;
					}
					date.d = this.monthLengths[date.m];
					//stop = true;
				} else {
					date.d = date.d-shift;
					stop = true;
				}
			}

			//return date.y+"-"+date.m+"-"+date.d;
			//console.log("date is",date.d,date.m);
			return date.d+" "+this.monthNamesRuShort[date.m];
		} else {
			date.d = date.d-shift;
			//return date.y+"-"+date.m+"-"+date.d;
			//console.log("date is",date.d,date.m);
			return date.d+" "+this.monthNamesRuShort[date.m];
		}

	},
	shiftDate: function(date,shift){
		date = this.decomposeDate(date);

		leftThisMonth = this.monthLengths[date.m-1] - date.d;
		if(shift>leftThisMonth){
			date.m += 1;
			date.d = 1;
			shift -= leftThisMonth;
			if(date.m>12) {
				date.m=1;
				date.y++;
			}
		} else {
			date.d += shift;
			if(date.d<10) date.d = "0"+date.d;
			if(date.m<10) date.m = "0"+date.m;
			return date.y+"-"+date.m+"-"+date.d;
		}
		//console.log("shift", shift,this.monthLengths[date.m-1])
		while(shift-this.monthLengths[date.m-1]>0){
			shift -= this.monthLengths[date.m-1];
			date.m++;
			if(date.m>12){
				date.m=1;
				date.y++;
			}
		}
		date.d += shift-1;

		if(date.d<10) date.d = "0"+date.d;
		if(date.m<10) date.m = "0"+date.m;

		return date.y+"-"+date.m+"-"+date.d;
	},
	hexToDec: function(hex){
		result = 0;
		j = 1;
		toDec = {"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"a":10,"b":11,"c":12,"d":13,"e":14,"f":15};
		for(i=hex.length-1; i>=0; i--){
			result += toDec[hex[i]]*j;
			j *= 16;
		}

		return result;
	},
	decToHex: function(dec){
		result = "";
		toHex = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","10":"a","11":"b","12":"c","13":"d","14":"e","15":"f"};
		zero = false;
		if(dec<=15){
			zero = true;
		}
		while(dec>15){
			remainder = toHex[dec%16+""];
			dec = Math.floor(dec/16);
			result = remainder + result;
		}

		result = toHex[dec+""] + result;
		if(zero){ result = "0"+result}
		return result;
	},
	checkColors: function(color){
		found = [
			[-1,-1,-1,-1],
			[-1,-1,-1,-1],
			[-1,-1,-1,-1]]
		score = 0;

		referenceColor = [[	//reds
			{min: this.hexToDec("02"),max: this.hexToDec("00")},
			{min: this.hexToDec("00"),max: this.hexToDec("ff")},
			{min: this.hexToDec("ff"),max: this.hexToDec("ff")},
			{min: this.hexToDec("ff"),max: this.hexToDec("02")}
		],[	//greens
			{min: this.hexToDec("87"),max: this.hexToDec("c9")},
			{min: this.hexToDec("c9"),max: this.hexToDec("a9")},
			{min: this.hexToDec("a9"),max: this.hexToDec("27")},
			{min: this.hexToDec("27"),max: this.hexToDec("87")}
		],[ //blues
			{min: this.hexToDec("fe"),max: this.hexToDec("1c")},
			{min: this.hexToDec("1c"),max: this.hexToDec("12")},
			{min: this.hexToDec("12"),max: this.hexToDec("06")},
			{min: this.hexToDec("06"),max: this.hexToDec("fe")}
		]];

		//console.log(referenceColor)

		curcolor = [this.hexToDec(color.substr(0,2)), this.hexToDec(color.substr(2,2)), this.hexToDec(color.substr(4,2))]

		//console.log("curcolor",curcolor,referenceColor);

		for(color_i = 0; color_i<curcolor.length; color_i++){
			for(j=0; j<referenceColor[color_i].length; j++){
				cur = curcolor[color_i];
				c1 = referenceColor[color_i][j].min;
				c2 = referenceColor[color_i][j].max;

				if(cur>c1){
					if(cur<c2){
						found[color_i][j] = 1;
					}
				} else if(cur<c1){
					if(cur>c2){
						found[color_i][j] = 1;
					}
				} else if(cur==c1) {
					found[color_i][j] = 1;
				} else if(cur==c2) {
					found[color_i][j] = 1;
				}
			}
		}

		for(i=0; i<4; i++){
			score = 0
			for(j=0; j<3; j++){
				score += found[j][i];
			}
			if(score==3){
				return 1;
			}
		}

		return -1;
	},
	color: function(days){
		//console.log("calculating color");

		var domain = [-31,105,176,288,335];
		var range = [
			["00","00","ff"],
			["00","c9","1c"],
			["ff","aa","13"],
			["ff","26","06"],
			["00","00","ff"]
		];

		resultClr = [0,0,0];

		var j=-1;
		while(j==-1) {
			for(var i=0; i<domain.length; i++){
				if(days<=domain[i]){
					j=i-1;
					break;
				}
			}
			if(j==-1){
				days -= domain[domain.length-1];
			}
		}

		ratio = (days - domain[j]) / (domain[j+1] - domain[j]);

		//console.log("ratio", ratio);

		for(var i=0; i<resultClr.length; i++){
			c1 = this.hexToDec(range[j][i]);
			c2 = this.hexToDec(range[j+1][i]);
			//console.log(c1,c2)

			resultClr[i] = this.decToHex(Math.round(c1 + (c2-c1)*ratio));
		}
		//console.log("result color", resultClr);

		return "#"+resultClr[0]+resultClr[1]+resultClr[2];
	}
}

//Модель — хранит состояние и данные
tickets = {
	lines: {},
	getLine: function(id){
		return this.lines[id];
	},
	getAllLines: function(){
		return this.lines;
	},
	loadData: function(data){

		nested = d3.nest()
				.key(function(d) { return d.to;})
				.key(function(d) { return d.departure;})
		nested = nested.entries(data);

		for(city=0; city<nested.length; city++){
			curCity = nested[city].key;
			cityData = nested[city].values;
			lines = {};

			for(i=0; i<cityData.length; i++){
				line = {};
				var curDate = cityData[i].key;
				var prices = cityData[i].values;

				lineData = [];
				for(j=0; j<prices.length; j++){
					point = {daysBeforeDeparture: Number(prices[j].days_to_departure), price: Number(prices[j].price)};
					lineData.push(point);
				}

				id = prices[0].carrier+"---"+curDate;
				line.state = "default";

				line.carrier = prices[0].carrier;
				line.from = prices[0].from;
				line.to = prices[0].to;
				line.data = lineData;
				line.date = curDate;

				lines[id] = line;
			}
			this.lines[curCity] = lines;
		}
	},
	getMaxParameter: function(curCity,parameter){
		max = -1;

		for(var city in this.lines){
			if(city==curCity){
				cityData = this.lines[city];

				for(var key in cityData){
					curData = cityData[key].data;

					for(i=0; i<curData.length; i++){
						if(curData[i][parameter] > max) max = curData[i][parameter];
					}

				}
				return max;
			}
		}

		return max;
	},
	setHover: function(id){			//устанавливает hover класс для линии
		//this.lines[id].state = 'hover';
		lineGraph.switchClass(id, 'hover')
	},
	setDefault: function(id){		//устанавливает default класс для линии
		//this.lines[id].state = 'default';
		lineGraph.switchClass(id, 'default')
	},
	findTodayPrice: function(city,key){	//возвращает цену рейса(key) за минимальное количество дней до вылета
		var days=100;
		var price = -1;
		lines = this.lines[city];
		//console.log ("graph data lenght",lines[key].data.length)
		if(lines[key].data.length > 1){
			lines[key].data.forEach(function(d){
				if(d.daysBeforeDeparture<days) {
					days = d.daysBeforeDeparture;
					price = d.price;
				}
			})
		}

		return price;
	},
	getMinMaxDate: function(){
		maxdate = "1000-01-01";
		mindate = "3000-12-31";
		for(var city in this.lines){
			cityData = this.lines[city];

			for(var key in cityData){
				if(helper.compareDates(cityData[key].date,maxdate)==1){
					maxdate = cityData[key].date;
				} else if (helper.compareDates(cityData[key].date,mindate)==-1){
					mindate = cityData[key].date;
				}
			}
		}

		return {mindate:mindate, maxdate:maxdate};
	}

}

scroll = {
	startfinishdates: [],
	curdate: "",
	width: 0,
	height: 35,
	margin: 10,
	controls:[],
	rightslider:[],
	getGradientStops: function(startstop){
		stopcolors = ["#0387fe","#00c91c","#ffaa12","#ff2706"];
		seasons = [0,0,1,1,1,2,2,2,3,3,3,0];
		stoppercents = [0];
		years = startstop.y2-startstop.y1;
		days = helper.getDaysCount(minmax.mindate,minmax.maxdate);
		while(years-1>0){
			//тут нужно добавлять стопы если период больше года;
		}
		curmonth = startstop.m1-1;
	},
	init: function(rootObject){
		minmaxdate = tickets.getMinMaxDate();
		this.startfinishdates[0] = minmaxdate.mindate;
		this.startfinishdates[1] = minmaxdate.maxdate;
		rootObject.append('svg')
			.attr('width',this.width)
			.attr('height',this.height+this.margin+4)
			.style('margin-top',-this.margin)

		rootObject.append('div')
			.attr('class','control left')
			.style('left','0px')

		rootObject.append('div')
			.attr('class','control right')
			.style('left',this.width+'px')

		rootObject = rootObject.select('svg');

		//minmax = tickets.getMinMaxDate();
		//minmax = helper.decomposeDates(minmax.mindate, minmax.maxdate);

		var gradient = rootObject
			.append("svg:defs")
			.append("svg:linearGradient")
			.attr("id", "slidergradient")
			.attr("x1", "0%")
			.attr("x2", "100%")
			.attr("spreadMethod", "pad");

		gradient.append("svg:stop")
			.attr("offset", "0%")
		    .attr("stop-color", "#76bb18")
		    .attr("stop-opacity", 0.25);

		gradient.append("svg:stop")
			.attr("offset", "13%")
		    .attr("stop-color", "#ffaa12")
		    .attr("stop-opacity", 0.25);

		gradient.append("svg:stop")
			.attr("offset", "40%")
		    .attr("stop-color", "#ff2706")
		    .attr("stop-opacity", 0.25);

		gradient.append("svg:stop")
			.attr("offset", "65%")
		    .attr("stop-color", "#0000ff")
		    .attr("stop-opacity", 0.25);

		gradient.append("svg:stop")
			.attr("offset", "90%")
		    .attr("stop-color", "#00c81c")
		    .attr("stop-opacity", 0.25);

		gradient.append("svg:stop")
			.attr("offset", "100%")
		    .attr("stop-color", "#53bf19")
		    .attr("stop-opacity", 0.25);

		var gradient = rootObject
			.append("svg:defs")
			.append("svg:linearGradient")
			.attr("id", "slidergradient2")
			.attr("x1", "0%")
			.attr("x2", "0%")
			.attr("y1", "0%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

		gradient.append("svg:stop")
			.attr("offset", "0%")
		    .attr("stop-color", "#fff")
		    .attr("stop-opacity", 0);

		gradient.append("svg:stop")
			.attr("offset", "100%")
		    .attr("stop-color", "#fff")
		    .attr("stop-opacity", 1);

		rootObject.append('rect')
			.attr('x',0)
			.attr('y',this.margin-5)
			.attr('width',this.width)
			.attr('height',this.height)
			.attr('fill','url(#slidergradient)')

		rootObject.append('rect')
			.attr('x',0)
			.attr('y',this.margin-5)
			.attr('width',this.width)
			.attr('height',this.height+1)
			.attr('fill','url(#slidergradient2)')

		rootObject.append('rect')
			.attr('class','left-rect')
			.attr('x',0)
			.attr('y',this.margin-5)
			.attr('width',0)
			.attr('height',this.height+5)
			.attr('fill','#fff')

		rootObject.append('rect')
			.attr('class','right-rect')
			.attr('x',this.width)
			.attr('y',this.margin-5)
			.attr('width',0)
			.attr('height',this.height+5)
			.attr('fill','#fff')

		rootObject.append('rect')
			.attr('class','cur-rect')
			.attr('x',0)
			.attr('y',this.margin-5)
			.attr('width',1)
			.attr('height',this.height+200)
			.attr('fill','#000')
			.attr('opacity',0)

		this.controls.push(d3.select('.slider .left')[0][0]);
		this.controls.push(d3.select('.slider .right')[0][0]);

		d3.select('.slider').style('height',this.height)
	},
	setWidth: function(){
		w = document.body.clientWidth*0.7;
		w -= 80;
		//this.width = w;
		this.width = 864;
	},
	updateState: function(delta,rootObject){
		left = d3.select(rootObject).style('left');
		left = +left.substr(0,left.indexOf('px'));
		left = left+delta;
		if(left<0){left=0}; if(left>this.width){left=this.width};
		curClass = d3.select(rootObject).attr('class');
		curClass = curClass.substr(curClass.indexOf(' ')+1,1000);
		if(curClass=="left"){
			rLeft = d3.select('.right').style('left');
			rLeft = +rLeft.substr(0,rLeft.indexOf('px'));
			if(left>rLeft) left = rLeft;
		} else {
			lLeft = d3.select('.left').style('left');
			lLeft = +lLeft.substr(0,lLeft.indexOf('px'));
			if(left<lLeft) left = lLeft;
		}
		d3.select(rootObject).style('left',left);

		d3.select('.'+curClass+'-rect')
			.attr('width',function(){
				if(curClass=='right'){
					return scroll.width-left;
				} else {
					return left;
				}
			})
			.attr('x',function(){
				if(curClass=='right'){
					return left;
				} else {
					return 0;
				}
			})
	},
	placeText: function(rootObject){
		first = true;
		newyear = false;
		monthsLeftMargin = [0];
		minmax = tickets.getMinMaxDate();
		days = helper.getDaysCount(minmax.mindate,minmax.maxdate);
		widthRatio = this.width/days;

		y1 = +minmax.mindate.substr(0,minmax.mindate.indexOf('-'));
		y2 = +minmax.maxdate.substr(0,minmax.mindate.indexOf('-'));
		years = y2-y1;

		m1 = +minmax.mindate.substr(minmax.mindate.indexOf('-')+1,1000).substr(0,minmax.mindate.indexOf('-')-2);
		m2 = +minmax.maxdate.substr(minmax.maxdate.indexOf('-')+1,1000).substr(0,minmax.maxdate.indexOf('-')-2);

		d1 = +minmax.mindate.substr(minmax.mindate.indexOf('-')+1,1000).substr(minmax.mindate.indexOf('-')-1,1000);
		d2 = +minmax.maxdate.substr(minmax.maxdate.indexOf('-')+1,1000).substr(minmax.maxdate.indexOf('-')-1,1000);

		monthsLeftMargin.push((helper.monthLengths[m1-1]-d1)*widthRatio);

		daysLeft = days-(helper.monthLengths[m1]-d1);
		curmonth = m1+1;
		stop = false;
		//console.log("curmonth", curmonth,m2,daysLeft,daysLeft-helper.monthLengths[curmonth]);

		while(!stop){
			if(daysLeft-helper.monthLengths[curmonth]>=0){
				monthsLeftMargin.push(helper.monthLengths[curmonth]*widthRatio+monthsLeftMargin[monthsLeftMargin.length-1]);
				daysLeft -= helper.monthLengths[curmonth];
				curmonth++;
				//console.log('added month',curmonth-1,daysLeft,helper.monthLengths[curmonth]);

			} else {
				stop=true;
			}
			if(curmonth>11){
				curmonth=0;
			}
		}
		//console.log("first month",m1)
		monthsCounter = m1-1;
		for(i=0; i<monthsLeftMargin.length; i++){
			if(first || newyear){
				var text = "";
				if(first) {
					text = "2014";
				} else if(newyear) {
					text = "2015";
				}

				rootObject.append('text')
				.attr('x',monthsLeftMargin[i])
				.attr('y',this.margin+18)
				.attr('dy', '.35em')
				.attr('fill','#000')
				.text(text)
				.attr('id','slider-stroke')

				rootObject.append('text')
				.attr('x',monthsLeftMargin[i])
				.attr('y',this.margin+18)
				.attr('dy', '.35em')
				.attr('fill','#000')
				.text(text);

				first=false;
				newyear = false;
			}

			rootObject.append('text')
				.attr('x',monthsLeftMargin[i])
				.attr('y',this.margin+2)
				.attr('dy', '.35em')
				.attr('fill','#000')
				.text(helper.monthNamesRuShort[monthsCounter])
				.attr('id','slider-stroke');


			rootObject.append('text')
				.attr('x',monthsLeftMargin[i])
				.attr('y',this.margin+2)
				.attr('dy', '.35em')
				.attr('fill','#000')
				.text(helper.monthNamesRuShort[monthsCounter]);

			monthsCounter++;
			if(monthsCounter>11){monthsCounter=0;
				newyear = true;};
		}


		/*



		dayscopy = days;
		monthsLeftMargin = [0];
		monthsLeftMargin.push((monthLengths[firstMonth-1]-firstMonthDay)/days*this.width);
		dayscopy -= (monthLengths[firstMonth-1]-firstMonthDay);

		stop = false;
		curmonth = firstMonth;
		while(!stop){
			while
		}

		console.log("min and max dates", minmax, days, firstMonthDay, lastMonthDay, firstMonth, lastMonth)
		*/
	},
	getCurrentDates: function(){
		minmax = tickets.getMinMaxDate();
		days = helper.getDaysCount(minmax.mindate,minmax.maxdate);

		start = d3.select('.slider .left').style('left');
		start = +start.substr(0,start.indexOf('px'));

		finish = d3.select('.slider .right').style('left');
		finish = +finish.substr(0,finish.indexOf('px'));

		startday = Math.round(start/this.width*days);
		finishday = Math.round(finish/this.width*days);

		//console.log("slider positions", start, startday, finish, finishday)

		startdate = helper.shiftDate(minmax.mindate,startday);
		finishdate = helper.shiftDate(minmax.mindate,finishday);
		//console.log("current dates", startdate, finishdate)

		return [startdate,finishdate];
	}
}

//Представление — рисует сам график, обрабатывает события
lineGraph = {
	selectedcircles: [],
	mouseoversvg: [-1,-1],
	mouseoverdocument: [-1,-1],
	scale: null,
	x: null,
	xAx: null,
	y: null,
	linefunc: {},
	scaleline: {},
	color: null,
	svglines: [],
	scalelines: [],
	width: 0,
	height: 350,
	margin: 10,
	scaleWidth: 20,
	tickPadding: 0,
	setLine: function(){

		this.color = d3.scale.linear()
					.domain([-31,105,176,288,335])
					.range(['#0000ff', '#00c91c', '#ffaa13','ff2606','#0000ff']);

		//x = {};
		//y = {};
		scale = this.scale;
		for(var key in tickets.lines) {

			//console.log("max price"+key,scale.price);

			padding = this.tickPadding;
			linesPadding = this.scaleWidth+this.margin +this.tickPadding;

			this.x = d3	.scale
	    			.linear()
	    			.range([linesPadding,this.width-20])
	    			.domain([scale.days,0]);

	    	this.xAx = d3	.scale
	    			.linear()
	    			.range([linesPadding+5,this.width-5])
	    			.domain([scale.days,0]);

	    	this.y = d3	.scale
	    			.linear()
	    			.range([10,this.height-15])
	    			.domain([scale.price-scale.price*0,0]);

	    	this.yAxis = d3.svg.axis().scale(this.y)
	    			.orient("left").tickValues([0, 3000,6000,9000,12000,15000]).tickPadding(-padding);

			this.linefunc[key] = d3.svg.line()
						//.interpolate('basis')
	    				.x(function(d) { return lineGraph.x(d.daysBeforeDeparture) })
	    				.y(function(d) { return lineGraph.y(d.price); })

	    	this.scaleline[key] = d3.svg.line()
	    				.x(function(d){ return d.x+padding})
	    				.y(function(d){ return lineGraph.y(d.price)})
	    }

	},
	setWidth: function(){
		//console.log('setting width');

		w = document.body.clientWidth;
		h = document.body.clientHeight;
		w -=80; //вычитаем отступы от краев окна
		d3.select('.mainContainer').style('width',w);

		w -=80; //вычитаем пробелы между графиками
		w -=50; //не учитываем легенду

		this.width = Math.round(w/3)-1;
		this.height = h-375;
	},
	init: function(rootObject, key){
		rootObject.append('div')
					.attr('class','graphContainer '+key)
					.append('h2')
					.html('Москва → '+helper.citynames[key])

		rootObject = d3.select('.'+key);

		rootObject.append('svg')
				.attr('width',this.width+20)
				.attr('height', this.height+20)

		return d3.select('.'+key+' svg');
	},
	drawLines: function(rootObject,city){

		rootObject
			.append('g')
			.attr('class','lines');

		rootObject = rootObject.select('.lines');
		lines = tickets.lines[city];
		cnt=0;

		xAxis = d3.svg.axis()
			.scale(this.x)
			.ticks(7)
			.tickFormat(function(d){
				if(d==90){
					return "90 дней";
				} else if(d==80 || d==0){
					return ""
				} else {
					return d
				}
			});

	   	rootObject.append('g')
	    	.attr('class','xAxis')
	    	.attr('transform','translate(0,'+(lineGraph.height-22)+')')
	    	.call(xAxis);

	    rootObject.select('g')
	    	.append('text')
	    	.attr('x',30)
			.attr('y',30)
			.attr('dy', '.35em')
			.attr('fill','#000')
			.text('до вылета');

		rootObject.select('g')
			.append('rect')
			.attr('width',1)
			.attr('height',9)
			.attr('x',this.width-20)
			.attr('y',9)
			.attr('fill','#ccc')

	   	rootObject.select('.xAxis').selectAll('text').style('text-anchor','start');
	   	rootObject.select('.xAxis').select('text').style('text-anchor','end')
	   		//.style('text-anchor','left');

		for(var key in lines){

			curData = lines[key];

			day = helper.getDayNum(curData.date);
			color="";
			color = helper.color(day-31);
			helper.colors.push({color:color,date:curData.date,city:city,key:key,day:day});

			date=curData.date;//key.substr(key.indexOf('---')+3,1000);
			if(curData.data.length>1){
				z = rootObject
					.append('g')
					.attr('class',key);

				q = z
					.append('path')
	      			.datum(curData.data)
	      			.attr('id','stroke-behind')
	      			.attr('class', 'line hidden')
	      			.attr('d', this.linefunc[city])
	      			.attr('stroke','#fff')
	      			.attr('date','date'+date)

				a = z
					.append('path')
	      			.datum(curData.data)
	      			.attr('id',key)
	      			.attr('class', 'line default')
	      			.attr('d', this.linefunc[city])
	      			.attr('stroke',color)
	      			.attr('date','date'+date)

	      		//console.log(curData.data)
	      		b = z
	      			.selectAll('circle')
	      			.data(curData.data)
	      			.enter()
	      			.append('circle')
	      			//.attr('id', key)
	      			.attr('class','circle-hidden')
	      			.attr('cx', function(d){
	      				return lineGraph.x(d.daysBeforeDeparture);
	      			})
	      			.attr('cy', function(d){
	      				return lineGraph.y(d.price)
	      			})
	      			.attr('r',2)
	      			.attr('fill',color)
	      			.attr('price',function(d){
	      				return d.price;
	      			})
	      			.attr('date','date'+date)
	      			.attr('before', function(d){
	      				return d.daysBeforeDeparture;
	      			})

	      		s = z.selectAll('circle');
	      		var prevX, prevY; var prevY, nextY;
	      		var coords = [];
	      		var first = true;
	      		for(i=0; i<s[0].length; i++){
	      			t = d3.select(s[0][i]);
	      			if(i!=s[0].length-1){
	      				tNext = d3.select(s[0][i+1])
	      			} else {
	      				tNext = -1;
	      			}
	      			if(first){
	      				prevX = +t.attr('cx');
	      				prevY = +t.attr('cy')
	      				z.append('text')
	      						.attr('x',+t.attr('cx')+5)
	      						.attr('y',t.attr('cy'))
	      						.attr("dy", ".35em")
	      						.attr('fill','#000')
	      						.text(function(){
	      							price = +t.attr('price');
	      							remainder = price%1000;
	      							remainder = Math.floor(remainder/100);
	      							price = Math.floor(price/1000);
	      							return price+","+remainder;
	      						})
	      						.attr('class','text-hidden');
	      				first = false;
	      			} else {
	      				var textX, textY, textAlign;
	      				curX = +t.attr('cx');
	      				curY = +t.attr('cy');
	      				if(tNext!=-1){
	      					nextX = +tNext.attr('cx');
	      					nextY = +tNext.attr('cy');

	      					if((nextY <= curY) && (prevY <= curY)){
	      						//текст снизу
	      						textX = +t.attr('cx')-8;
	      						textY = +t.attr('cy')+9;
	      					} else if((nextY > curY) && (prevY > curY)){
	      						//текст сверху
	      						textX = +t.attr('cx')-8;
	      						textY = +t.attr('cy')-9;
	      					} else if((nextY > curY) && (prevY <= curY)){
	      						//текст справа-снизу
	      						textX = +t.attr('cx')+2;
	      						textY = +t.attr('cy')+9;
	      					} else if((nextY <= curY) && (prevY > curY)){
	      						//текст слева-снизу
	      						textX = +t.attr('cx')+2;
	      						textY = +t.attr('cy')-9;
	      					} else {
	      						textX = +t.attr('cx')+3;
	      						textY = +t.attr('cy');
	      					}
	      				} else {
	      					textX = +t.attr('cx')-10;
	      					textY = +t.attr('cy')-9;
	      				}

	      				diffX = Math.abs(curX-(+prevX));
	      				diffY = Math.abs(curY-(+prevY));

	      				hypotenuse = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2))
	      				//console.log("coords", curX, +prevX, curY, +prevY, diffX, diffY, hypotenuse)
	      				if(hypotenuse>30){
	      					//добавляем подпись
	      					z.append('text')
	      						.attr('x',textX)
	      						.attr('y',textY)
	      						.attr("dy", ".35em")
	      						.attr('fill','#000')
	      						.text(function(){
	      							price = +t.attr('price');
	      							remainder = price%1000;
	      							remainder = Math.floor(remainder/100);
	      							price = Math.floor(price/1000);
	      							return price+","+remainder;
	      						})
	      						.attr('class','text-hidden')
	      						//.style('text-anchor',textAlign);

	      					prevX = +t.attr('cx');
	      					prevY = +t.attr('cy');
	      				}
	      			}
					coords.push(t.attr('cx'));
	      		}
	      		//console.log("circles x coords", coords)

	      		this.svglines.push(a[0][0]);
	      	}
		}
	},
	drawScale: function(rootObject,city){

		//console.log("drawing scale "+city);

		rootObject
			.append('g')
			.attr('class','scalelines');

		rootObject = rootObject.select('.scalelines');

		/*rootObject.append('g')
        	.attr('class', 'yAxis')
        	.call(this.yAxis);*/

        lines = tickets.lines[city];

		for(var key in lines){
			curData = lines[key];
			day = helper.getDayNum(lines[key].date);
			color="";
			color = helper.color(day-31);

			price = tickets.findTodayPrice(city,key);
			if(price > 0) {
				scaleData = [];
				scaleData.push({x: 0, price: price});
				scaleData.push({x: this.scaleWidth, price: price});

				date=curData.date; //date=key.substr(key.indexOf('---')+3,1000);

				if(scaleData[0].price != -1){

					/*z = rootObject.append('path')
		      			.datum(curData.data)
		      			.attr('id','stroke-behind')
		      			.attr('class', 'line hidden')
		      			.attr('d', this.linefunc[city])
		      			.attr('stroke','#fff')
		      			.attr('date','date'+date);*/

		      		z = rootObject
						.append('g')
						.attr('class',key);

		      		q = z
						.append('path')
						.datum(scaleData)
						.attr('id','stroke-behind')
						.attr('class', 'line hidden')
						.attr('d', this.scaleline[city])
						.attr('stroke','#fff')
						.attr('date','date'+date)

					a = z
						.append('path')
						.datum(scaleData)
						.attr('id',key)
						.attr('class', 'line default')
						.attr('d', this.scaleline[city])
						.attr('stroke',color)
						.attr('date','date'+date)

					this.svglines.push(a[0][0]);
				}
			}
		}
	},
	drawAxis: function(rootObject){
		rootObject.insert("div", ":first-child")
			.attr('class','axisContainer')
			.append('svg')
			.attr('width',50)
			.attr('height',this.height);

		rootObject = d3.select('.axisContainer svg');

		//console.log("format",d3.format(',.0f'))

		yAxis = d3.svg.axis()
	    	.scale(this.y)
	    	.ticks(7)
	    	.orient("left")
	    	.tickFormat(function(d){
	    		if(d>=1000){

	    			d = Math.floor(d/1000);

	    			return d+" тыс."
	    			/*stop = false;
	    			d = d+"";

	    			end = d.substr(d.length-3,1000);
	    			d = d.substr(0,d.length-3);

	    			//console.log("format", d, end)

	    			while(!stop){
	    				if(Number(d)<1000){
	    					stop = true;
	    				} else {
	    					end = d.substr(d.length-3,1000)+" "+end;
	    					d.substr(0,d.length-3);
	    				}
	    			}

	    			return d+" "+end;*/
	    		} else {
	    			return d+" руб.";
	    		}
	    	});

	    rootObject.append('g')
	    	.attr('class','yAxis')
	    	.attr('transform','translate(50,0)')
	    	.call(yAxis);
	},
	updateClass: function(selection, newclass){
		selection.attr('class','line '+newclass);
	},
	switchClass: function(id, newclass){
		d3.selectAll('#'+id).attr('class','line '+newclass);
		line = d3.selectAll('#'+id);
		line[0].forEach(function(d){

			//d.parentNode.appendChild(d)
			//d.parentNode.appendChild(d);
		})
		//line.parentNode.appendChild(line);
	},
	setScale: function(){
		maxD = -1;
		maxP = -1;
		for(var key in tickets.lines){
			days = tickets.getMaxParameter(key, 'daysBeforeDeparture');
			price = tickets.getMaxParameter(key, 'price');

			if(days > maxD) maxD = days;
			if(price > maxP) maxP = price;

			//this.scale[key] = {days:days,price:price};
		}
		this.scale = {days:maxD, price:maxP}
	},
	showClosestCircle: function(circlelist,graphnode){

		if(lineGraph.mouseoversvg[0]+lineGraph.mouseoversvg[1]>=0){
			x = lineGraph.mouseoversvg[0];
			y = lineGraph.mouseoversvg[1];
			//console.log('coordinates', x,y)

			//console.log("searching for closest dot",x,y);

			diff = 1000000;
			var selected; var temp;

			circlelist[0].forEach(function(d){
				temp = d3.select(d);
				tempX = +temp.attr('cx');
				tempY = +temp.attr('cy');
				//console.log("searching for closest dot",x,tempX,tempY,y);
				curdiffX = Math.abs(tempX - x);
				curdiffY = Math.abs(tempY - y);
				subtense = Math.sqrt(Math.pow(curdiffX,2)+Math.pow(curdiffY,2))
				if(subtense<diff){
					diff = subtense;
					//console.log("found selected",x,tempX,tempY,y)
					selected = temp;
				}
			});
			//console.log("selected",selected);
			//this.selectedcircles.push(selected[0]);
			date = helper.shiftBefore(selected.attr('date').substr(4,1000),+selected.attr('before'));
			price = selected.attr('price');
			string = date+", "+price+" руб.";
			d3.select('.tooltip-before')
					.style('display','block')
					.style('left',lineGraph.mouseoverdocument[0])
					.style('top',lineGraph.mouseoverdocument[1]-18)
					.html(string);
			selected.attr('class','circle-default');
		}
		//var x = event.clientX;     // Get the horizontal coordinate
		//var y = event.clientY;

		//console.log("graphnode", graphnode,x,y)

	}
}

//Обрабатывает события браузера и мыши
controller = {
	init: function(data, rootObject){
		helper.setCumulativeDates();
		helper.getDayNum("2015-03-01");

		tickets.loadData(data);
		lineGraph.setWidth();
		lineGraph.setScale();

		//console.log(tickets.lines)
		//scale = {days: tickets.getMaxDays(), price: tickets.getMaxPrice()};
		lineGraph.setLine();
		//console.log(lineGraph.y['Simferopol'](40000),lineGraph.y['Berlin'](40000),lineGraph.y['Tivat'](40000))
		for(var key in tickets.lines){
			svg = lineGraph.init(rootObject,key);
			lineGraph.drawLines(svg,key)
			lineGraph.drawScale(svg,key)
		}
		d3.select('.graphContainer h2').attr('class','first-h2');
		d3.select('.graphContainer').attr('class',d3.select('.graphContainer').attr('class')+' first');

		lineGraph.drawAxis(rootObject);

		scroll.setWidth();
		scroll.init(d3.select('.slider'))
		scroll.placeText(d3.select('.slider svg'));
	},
	setHover: function(){
		document.onmousemove = function(event){
			lineGraph.mouseoverdocument[0] = event.pageX;
			lineGraph.mouseoverdocument[1] = event.pageY;

			//console.log("document coordinates", lineGraph.mouseoverdocument[0],lineGraph.mouseoverdocument[1])
		}
		d3.selectAll(".graph svg").on('mousemove',function(e){
			//console.log("detecting mousemove");
			lineGraph.mouseoversvg[0] = d3.mouse(this)[0];
			lineGraph.mouseoversvg[1] = d3.mouse(this)[1];

			//console.log(lineGraph.mouseoversvg)
		})
		d3.select(".slider svg").on('mouseout', function(){
			if(scroll.curdate!=""){
				datelist = d3.selectAll("[date="+"date"+scroll.curdate+"]");

				datelist[0].forEach(function(d){
					parent = d3.select(d.parentNode);
						if(parent.attr('class')!='scalelines'){
							parent.selectAll('circle').attr('class','circle-hidden');
							textlist = parent.selectAll('text').attr('class','text-hidden');
						}
						id = d3.select(d).attr('id');
						if(d3.select(d).attr('id')=="stroke-behind"){
							d3.select(d).attr('class','line hidden');
						} else {
							tickets.setDefault(id);
						}
				})
				scroll.curdate = "";
			}
			d3.select('.cur-rect')
				.attr('opacity',0);

			d3.select('.tooltip-before')
				.html("");
		})
		d3.select(".slider svg").on('mousemove', function(){

			xPos = d3.mouse(this)[0];
			days = helper.getDaysCount(minmax.mindate,minmax.maxdate);
			ratio = xPos/scroll.width;
			day = Math.round(days*ratio);
			date = helper.shiftDate(minmax.mindate,day);

			compareMin = helper.compareDates(date,scroll.startfinishdates[0]);
			compareMax = helper.compareDates(date,scroll.startfinishdates[1]);

			if((compareMin>0)&&(compareMax<0)){

				if(scroll.curdate!=""){
					datelist = d3.selectAll("[date="+"date"+scroll.curdate+"]");

					datelist[0].forEach(function(d){
						parent = d3.select(d.parentNode);
							if(parent.attr('class')!='scalelines'){
								parent.selectAll('circle').attr('class','circle-hidden');
								textlist = parent.selectAll('text').attr('class','text-hidden');
							}
							id = d3.select(d).attr('id');
							if(d3.select(d).attr('id')=="stroke-behind"){
								d3.select(d).attr('class','line hidden');
							} else {
								tickets.setDefault(id);
							}
					})
				}

				day = helper.getDayNum(date);
				color="";
				color = helper.color(day-31);

				daynum = day;
				d3.select('.cur-rect')
					.attr('x',xPos)
					.attr('fill', color)
					.attr('opacity', 1);

				curdate = helper.decomposeDate(date);
				datetext = "Вылет "+curdate.d+" "+helper.monthNamesRuR[curdate.m-1];

				d3.select('.tooltip-before')
					.style('display','block')
					.style('left',function(){
								//return lineGraph.mouseoverdocument[0]
						coord = d3.select('.cur-rect').attr('x');
						console.log("current rect coord",coord);
						return coord;
					})
					.html(datetext);

				scroll.curdate = date;
				datelist = d3.selectAll("[date="+"date"+date+"]");
				//console.log("scroll date", day, date, datelist)

				datelist[0].forEach(function(d){
					parent = d3.select(d.parentNode);
					d.parentNode.parentNode.appendChild(d.parentNode);
					if(parent.attr('class')!='scalelines'){
						textlist = parent.selectAll('text').attr('class','text-default');
						circlelist = parent.selectAll('circle').attr('class','circle-default');
					}
					id = d3.select(d).attr('id');
					if(d3.select(d).attr('id')=="stroke-behind"){
						d3.select(d).attr('class','line stroke');
					} else {
						tickets.setHover(id);
					}
				})

				console.log("slider day", day, date);
			}
		})
		lineGraph.svglines.forEach(function(d){
			d3.select(d).on('mouseover', function(){
				curclass=d3.select(this).attr('class');
				curdate = d3.select(this).attr('date');
				daynum = helper.getDayNum(curdate.substr(4,1000));
				color = d3.select(this).attr('stroke');



				if(curclass!='line hidden'){
					d3.select('.cur-rect')
					.attr('x',function(){
						days = helper.getDaysCount(minmax.mindate,minmax.maxdate);
						startday = helper.getDayNum(minmax.mindate);
						console.log("current day", daynum, startday, days);
						if(daynum+(365-startday)>days) {
							daynum = daynum+(days-startday)-days-1;
						} else {
							daynum += (365-startday)-1;
						}
						ratio = daynum/days;
						//ratio = (lineGraph.mouseoversvg[0]-30)/(lineGraph.width-30);
						return scroll.width*ratio;
					})
					.attr('fill',color)
					.attr('opacity', 1);
				curdate = helper.decomposeDate(curdate.substr(4,1000));
				datetext = "Вылет: "+curdate.d+" "+helper.monthNamesRuR[curdate.m-1];
					d3.select('.tooltip-before')
						.style('display','block')
						.style('left',function(){
							//return lineGraph.mouseoverdocument[0]
							coord = d3.select('.cur-rect').attr('x');
							console.log("current rect coord",coord);
							return coord;
						})
						//.style('top',lineGraph.mouseoverdocument[1]-19)
						.html(datetext);
					//console.log("hover class",curclass)
					date = d3.select(this).attr('date');
					//this.parentNode.parentNode.appendChild(this.parentNode);
					//console.log("hover this", this.parentNode)
					//d3.select(this.parentNode).selectAll('circle').attr('class','circle-default')
					//d3.selectAll('circle',this).attr('class','circle-default')
					datelist = d3.selectAll("[date="+date+"]");
					//console.log("date list", datelist)
					graphparent = d.parentNode.parentNode.parentNode.parentNode;
					datelist[0].forEach(function(d){
						parent = d3.select(d.parentNode);
						//console.log("datelist element", d, d.parentNode.parentNode)
						d.parentNode.parentNode.appendChild(d.parentNode);
						//console.log(d.parentNode.parentNode, d.parentNode)
						if(parent.attr('class')!='scalelines'){
							//circlelist = parent.selectAll('circle');
							textlist = parent.selectAll('text').attr('class','text-default');
							//lineGraph.showClosestCircle(circlelist,graphparent)
							circlelist = parent.selectAll('circle').attr('class','circle-default');
						}
						id = d3.select(d).attr('id');
						if(d3.select(d).attr('id')=="stroke-behind"){
							d3.select(d).attr('class','line stroke');
						} else {
							tickets.setHover(id);
						}
					})
				}
			})

			d3.select(d).on('mouseout', function(){
				curclass=d3.select(this).attr('class');

				d3.select('.tooltip-before')
				.html("");
					//.style('display','none');

				d3.select('.cur-rect')
					.attr('opacity',0)

				if(curclass!='line hidden'){
					date = d3.select(this).attr('date');
					datelist = d3.selectAll("[date="+date+"]");
					datelist[0].forEach(function(d){
						parent = d3.select(d.parentNode);
						if(parent.attr('class')!='scalelines'){
							parent.selectAll('circle').attr('class','circle-hidden');
							textlist = parent.selectAll('text').attr('class','text-hidden');
						}
						id = d3.select(d).attr('id');
						if(d3.select(d).attr('id')=="stroke-behind"){
							d3.select(d).attr('class','line hidden');
						} else {
							tickets.setDefault(id);
						}
					})
				}
			})
		})
		lineGraph.scalelines.forEach(function(d){
			d3.select(d).on('mouseover', function(){
				curclass=d3.select(this).attr('class');
				if(curclass!='line hidden'){
					date = d3.select(this).attr('date');
					datelist = d3.selectAll("[date="+date+"]");
					datelist[0].forEach(function(d){
						id = d3.select(d).attr('id');
						tickets.setHover(id);
					})
				}
			})

			d3.select(d).on('mouseout', function(){
				curclass=d3.select(this).attr('class');

				if(curclass!='line hidden'){
					date = d3.select(this).attr('date');
					datelist = d3.selectAll("[date="+date+"]");
					datelist[0].forEach(function(d){
						id = d3.select(d).attr('id');
						tickets.setDefault(id);
					})
				}
			})
		})
		scroll.controls.forEach(function(d){

			var drag = d3.behavior.drag().on('drag', function(){
				scroll.updateState(d3.event.dx,this)
				startfinishdates = scroll.getCurrentDates();
				console.log("start and finish dates", startfinishdates, scroll.startfinishdates)

				scroll.startfinishdates[0] = startfinishdates[0];
				scroll.startfinishdates[1] = startfinishdates[1];


				d3.selectAll('.line')
					.attr('class',function(){
						currentdate = d3.select(this).attr('date');
						currentdate = currentdate.substr(4,1000);
						//console.log(currentdate);
						morethanstart = helper.compareDates(currentdate,startfinishdates[0]);
						lessthanfinish = helper.compareDates(currentdate,startfinishdates[1]);
						if(morethanstart<0) {return "line hidden"};
						if(lessthanfinish>0) {return "line hidden"};
						return "line default";
						//if(morethanstart<0 || lessthanfinish>0){
						//	return 'line hidden';
						//} else {
						//	return 'line default';
						//}
					})
				/*
				a = d3.event.dx;
				left = d3.select(this).style('left');
				left = +left.substr(0,left.indexOf('px'));
				left = left+a;
				if(left<-11){left=-11}; if(left>scroll.width-11){left=scroll.width-11};
				d3.select(this).style('left',left);
				*/
			});

			//console.log(d3.select(d))
			d3.select(d).call(drag);
		})
	}
}

$(document).ready(function () {
	d3.csv('data/mos-simferopol.csv', function(data){
		controller.init(data, d3.select('.graph'))
		controller.setHover();
		//console.log("colors",helper.colors)

		helper.checkColors("00c91c");
		//console.log(lineGraph.color(308-32));
		helper.color(308-32);
	})
});
