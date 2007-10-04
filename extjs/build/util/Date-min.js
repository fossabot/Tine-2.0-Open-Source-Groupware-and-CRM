/*
 * Ext JS Library 2.0 Alpha 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Date.parseFunctions={count:0};Date.parseRegexes=[];Date.formatFunctions={count:0};Date.prototype.dateFormat=function(B){if(Date.formatFunctions[B]==null){Date.createNewFormat(B)}var A=Date.formatFunctions[B];return this[A]()};Date.prototype.format=Date.prototype.dateFormat;Date.createNewFormat=function(format){var funcName="format"+Date.formatFunctions.count++;Date.formatFunctions[format]=funcName;var code="Date.prototype."+funcName+" = function(){return ";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true}else{if(special){special=false;code+="'"+String.escape(ch)+"' + "}else{code+=Date.getFormatCode(ch)}}}eval(code.substring(0,code.length-3)+";}")};Date.getFormatCode=function(A){switch(A){case"d":return"String.leftPad(this.getDate(), 2, '0') + ";case"D":return"Date.dayNames[this.getDay()].substring(0, 3) + ";case"j":return"this.getDate() + ";case"l":return"Date.dayNames[this.getDay()] + ";case"S":return"this.getSuffix() + ";case"w":return"this.getDay() + ";case"z":return"this.getDayOfYear() + ";case"W":return"this.getWeekOfYear() + ";case"F":return"Date.monthNames[this.getMonth()] + ";case"m":return"String.leftPad(this.getMonth() + 1, 2, '0') + ";case"M":return"Date.monthNames[this.getMonth()].substring(0, 3) + ";case"n":return"(this.getMonth() + 1) + ";case"t":return"this.getDaysInMonth() + ";case"L":return"(this.isLeapYear() ? 1 : 0) + ";case"Y":return"this.getFullYear() + ";case"y":return"('' + this.getFullYear()).substring(2, 4) + ";case"a":return"(this.getHours() < 12 ? 'am' : 'pm') + ";case"A":return"(this.getHours() < 12 ? 'AM' : 'PM') + ";case"g":return"((this.getHours() % 12) ? this.getHours() % 12 : 12) + ";case"G":return"this.getHours() + ";case"h":return"String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0') + ";case"H":return"String.leftPad(this.getHours(), 2, '0') + ";case"i":return"String.leftPad(this.getMinutes(), 2, '0') + ";case"s":return"String.leftPad(this.getSeconds(), 2, '0') + ";case"O":return"this.getGMTOffset() + ";case"T":return"this.getTimezone() + ";case"Z":return"(this.getTimezoneOffset() * -60) + ";default:return"'"+String.escape(A)+"' + "}};Date.parseDate=function(A,C){if(Date.parseFunctions[C]==null){Date.createParser(C)}var B=Date.parseFunctions[C];return Date[B](A)};Date.createParser=function(format){var funcName="parse"+Date.parseFunctions.count++;var regexNum=Date.parseRegexes.length;var currentGroup=1;Date.parseFunctions[format]=funcName;var code="Date."+funcName+" = function(input){\n"+"var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, o, z, v;\n"+"var d = new Date();\n"+"y = d.getFullYear();\n"+"m = d.getMonth();\n"+"d = d.getDate();\n"+"var results = input.match(Date.parseRegexes["+regexNum+"]);\n"+"if (results && results.length > 0) {";var regex="";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true}else{if(special){special=false;regex+=String.escape(ch)}else{var obj=Date.formatCodeToRegex(ch,currentGroup);currentGroup+=obj.g;regex+=obj.s;if(obj.g&&obj.c){code+=obj.c}}}}code+="if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"+"{v = new Date(y, m, d, h, i, s);}\n"+"else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"+"{v = new Date(y, m, d, h, i);}\n"+"else if (y >= 0 && m >= 0 && d > 0 && h >= 0)\n"+"{v = new Date(y, m, d, h);}\n"+"else if (y >= 0 && m >= 0 && d > 0)\n"+"{v = new Date(y, m, d);}\n"+"else if (y >= 0 && m >= 0)\n"+"{v = new Date(y, m);}\n"+"else if (y >= 0)\n"+"{v = new Date(y);}\n"+"}return (v && (z || o))?\n"+"    ((z)? v.add(Date.SECOND, (v.getTimezoneOffset() * 60) + (z*1)) :\n"+"        v.add(Date.HOUR, (v.getGMTOffset() / 100) + (o / -100))) : v\n"+";}";Date.parseRegexes[regexNum]=new RegExp("^"+regex+"$","i");eval(code)};Date.formatCodeToRegex=function(B,A){switch(B){case"D":return{g:0,c:null,s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};case"j":return{g:1,c:"d = parseInt(results["+A+"], 10);\n",s:"(\\d{1,2})"};case"d":return{g:1,c:"d = parseInt(results["+A+"], 10);\n",s:"(\\d{2})"};case"l":return{g:0,c:null,s:"(?:"+Date.dayNames.join("|")+")"};case"S":return{g:0,c:null,s:"(?:st|nd|rd|th)"};case"w":return{g:0,c:null,s:"\\d"};case"z":return{g:0,c:null,s:"(?:\\d{1,3})"};case"W":return{g:0,c:null,s:"(?:\\d{2})"};case"F":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+A+"].substring(0, 1).toUpperCase() + results["+A+"].substring(1, 3).toLowerCase()], 10);\n",s:"("+Date.monthNames.join("|")+")"};case"M":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+A+"].substring(0, 1).toUpperCase() + results["+A+"].substring(1, 3).toLowerCase()], 10);\n",s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};case"n":return{g:1,c:"m = parseInt(results["+A+"], 10) - 1;\n",s:"(\\d{1,2})"};case"m":return{g:1,c:"m = parseInt(results["+A+"], 10) - 1;\n",s:"(\\d{2})"};case"t":return{g:0,c:null,s:"\\d{1,2}"};case"L":return{g:0,c:null,s:"(?:1|0)"};case"Y":return{g:1,c:"y = parseInt(results["+A+"], 10);\n",s:"(\\d{4})"};case"y":return{g:1,c:"var ty = parseInt(results["+A+"], 10);\n"+"y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",s:"(\\d{1,2})"};case"a":return{g:1,c:"if (results["+A+"] == 'am') {\n"+"if (h == 12) { h = 0; }\n"+"} else { if (h < 12) { h += 12; }}",s:"(am|pm)"};case"A":return{g:1,c:"if (results["+A+"] == 'AM') {\n"+"if (h == 12) { h = 0; }\n"+"} else { if (h < 12) { h += 12; }}",s:"(AM|PM)"};case"g":case"G":return{g:1,c:"h = parseInt(results["+A+"], 10);\n",s:"(\\d{1,2})"};case"h":case"H":return{g:1,c:"h = parseInt(results["+A+"], 10);\n",s:"(\\d{2})"};case"i":return{g:1,c:"i = parseInt(results["+A+"], 10);\n",s:"(\\d{2})"};case"s":return{g:1,c:"s = parseInt(results["+A+"], 10);\n",s:"(\\d{2})"};case"O":return{g:1,c:["o = results[",A,"];\n","var sn = o.substring(0,1);\n","var hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60);\n","var mn = o.substring(3,5) % 60;\n","o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))?\n","    (sn + String.leftPad(hr, 2, 0) + String.leftPad(mn, 2, 0)) : null;\n"].join(""),s:"([+-]\\d{4})"};case"T":return{g:0,c:null,s:"[A-Z]{1,4}"};case"Z":return{g:1,c:"z = results["+A+"];\n"+"z = (-43200 <= z*1 && z*1 <= 50400)? z : null;\n",s:"([+-]?\\d{1,5})"};default:return{g:0,c:null,s:String.escape(B)}}};Date.prototype.getTimezone=function(){return this.toString().replace(/^.*? ([A-Z]{1,4})[\-+][0-9]{4} .*$/,"$1")};Date.prototype.getGMTOffset=function(){return(this.getTimezoneOffset()>0?"-":"+")+String.leftPad(Math.abs(Math.floor(this.getTimezoneOffset()/60)),2,"0")+String.leftPad(this.getTimezoneOffset()%60,2,"0")};Date.prototype.getDayOfYear=function(){var A=0;Date.daysInMonth[1]=this.isLeapYear()?29:28;for(var B=0;B<this.getMonth();++B){A+=Date.daysInMonth[B]}return A+this.getDate()-1};Date.prototype.getWeekOfYear=function(){var B=this.getDayOfYear()+(4-this.getDay());var A=new Date(this.getFullYear(),0,1);var C=(7-A.getDay()+4);return String.leftPad(((B-C)/7)+1,2,"0")};Date.prototype.isLeapYear=function(){var A=this.getFullYear();return((A&3)==0&&(A%100||(A%400==0&&A)))};Date.prototype.getFirstDayOfMonth=function(){var A=(this.getDay()-(this.getDate()-1))%7;return(A<0)?(A+7):A};Date.prototype.getLastDayOfMonth=function(){var A=(this.getDay()+(Date.daysInMonth[this.getMonth()]-this.getDate()))%7;return(A<0)?(A+7):A};Date.prototype.getFirstDateOfMonth=function(){return new Date(this.getFullYear(),this.getMonth(),1)};Date.prototype.getLastDateOfMonth=function(){return new Date(this.getFullYear(),this.getMonth(),this.getDaysInMonth())};Date.prototype.getDaysInMonth=function(){Date.daysInMonth[1]=this.isLeapYear()?29:28;return Date.daysInMonth[this.getMonth()]};Date.prototype.getSuffix=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th"}};Date.daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];Date.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];Date.dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];Date.y2kYear=50;Date.monthNumbers={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};Date.prototype.clone=function(){return new Date(this.getTime())};Date.prototype.clearTime=function(A){if(A){return this.clone().clearTime()}this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this};if(Ext.isSafari){Date.brokenSetMonth=Date.prototype.setMonth;Date.prototype.setMonth=function(A){if(A<=-1){var D=Math.ceil(-A);var C=Math.ceil(D/12);var B=(D%12)?12-D%12:0;this.setFullYear(this.getFullYear()-C);return Date.brokenSetMonth.call(this,B)}else{return Date.brokenSetMonth.apply(this,arguments)}}}Date.MILLI="ms";Date.SECOND="s";Date.MINUTE="mi";Date.HOUR="h";Date.DAY="d";Date.MONTH="mo";Date.YEAR="y";Date.prototype.add=function(B,C){var D=this.clone();if(!B||C===0){return D}switch(B.toLowerCase()){case Date.MILLI:D.setMilliseconds(this.getMilliseconds()+C);break;case Date.SECOND:D.setSeconds(this.getSeconds()+C);break;case Date.MINUTE:D.setMinutes(this.getMinutes()+C);break;case Date.HOUR:D.setHours(this.getHours()+C);break;case Date.DAY:D.setDate(this.getDate()+C);break;case Date.MONTH:var A=this.getDate();if(A>28){A=Math.min(A,this.getFirstDateOfMonth().add("mo",C).getLastDateOfMonth().getDate())}D.setDate(A);D.setMonth(this.getMonth()+C);break;case Date.YEAR:D.setFullYear(this.getFullYear()+C);break}return D};Date.prototype.between=function(C,A){var B=this.getTime();return B>=C.getTime()&&B<=A.getTime()};