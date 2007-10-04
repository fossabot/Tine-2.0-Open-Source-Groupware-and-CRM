/*
 * Ext JS Library 2.0 Alpha 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.util.Observable=function(){if(this.listeners){this.on(this.listeners);delete this.listeners}};Ext.util.Observable.prototype={fireEvent:function(){if(this.eventsSuspended!==true){var A=this.events[arguments[0].toLowerCase()];if(typeof A=="object"){return A.fire.apply(A,Array.prototype.slice.call(arguments,1))}}return true},filterOptRe:/^(?:scope|delay|buffer|single)$/,addListener:function(A,C,B,F){if(typeof A=="object"){F=A;for(var E in F){if(this.filterOptRe.test(E)){continue}if(typeof F[E]=="function"){this.addListener(E,F[E],F.scope,F)}else{this.addListener(E,F[E].fn,F[E].scope,F[E])}}return }F=(!F||typeof F=="boolean")?{}:F;A=A.toLowerCase();var D=this.events[A]||true;if(typeof D=="boolean"){D=new Ext.util.Event(this,A);this.events[A]=D}D.addListener(C,B,F)},removeListener:function(A,C,B){var D=this.events[A.toLowerCase()];if(typeof D=="object"){D.removeListener(C,B)}},purgeListeners:function(){for(var A in this.events){if(typeof this.events[A]=="object"){this.events[A].clearListeners()}}},relayEvents:function(F,D){var E=function(G){return function(){return this.fireEvent.apply(this,Ext.combine(G,Array.prototype.slice.call(arguments,0)))}};for(var C=0,A=D.length;C<A;C++){var B=D[C];if(!this.events[B]){this.events[B]=true}F.on(B,E(B),this)}},addEvents:function(A){if(!this.events){this.events={}}Ext.applyIf(this.events,A)},hasListener:function(A){var B=this.events[A];return typeof B=="object"&&B.listeners.length>0},suspendEvents:function(){this.eventsSuspended=true},resumeEvents:function(){this.eventsSuspended=false},getMethodEvent:function(G){if(!this.methodEvents){this.methodEvents={}}var F=this.methodEvents[G];if(!F){F={};this.methodEvents[G]=F;F.originalFn=this[G];F.methodName=G;F.before=[];F.after=[];var C,B,D;var E=this;var A=function(J,I,H){if((B=J.apply(I||E,H))!==undefined){if(typeof B==="object"){if(B.returnValue!==undefined){C=B.returnValue}else{C=B}if(B.cancel===true){D=true}}else{if(B===false){D=true}else{C=B}}}};this[G]=function(){C=B=undefined;D=false;var I=Array.prototype.slice.call(arguments,0);for(var J=0,H=F.before.length;J<H;J++){A(F.before[J].fn,F.before[J].scope,I);if(D){return C}}if((B=F.originalFn.apply(E,I))!==undefined){C=B}for(var J=0,H=F.after.length;J<H;J++){A(F.after[J].fn,F.after[J].scope,I);if(D){return C}}return C}}return F},beforeMethod:function(D,B,A){var C=this.getMethodEvent(D);C.before.push({fn:B,scope:A})},afterMethod:function(D,B,A){var C=this.getMethodEvent(D);C.after.push({fn:B,scope:A})},removeMethodListener:function(F,D,C){var E=this.getMethodEvent(F);for(var B=0,A=E.before.length;B<A;B++){if(E.before[B].fn==D&&E.before[B].scope==C){E.before.splice(B,1);return }}for(var B=0,A=E.after.length;B<A;B++){if(E.after[B].fn==D&&E.after[B].scope==C){E.after.splice(B,1);return }}}};Ext.util.Observable.prototype.on=Ext.util.Observable.prototype.addListener;Ext.util.Observable.prototype.un=Ext.util.Observable.prototype.removeListener;Ext.util.Observable.capture=function(C,B,A){C.fireEvent=C.fireEvent.createInterceptor(B,A)};Ext.util.Observable.releaseCapture=function(A){A.fireEvent=Ext.util.Observable.prototype.fireEvent};(function(){var B=function(F,G,E){var D=new Ext.util.DelayedTask();return function(){D.delay(G.buffer,F,E,Array.prototype.slice.call(arguments,0))}};var C=function(F,G,E,D){return function(){G.removeListener(E,D);return F.apply(D,arguments)}};var A=function(E,F,D){return function(){var G=Array.prototype.slice.call(arguments,0);setTimeout(function(){E.apply(D,G)},F.delay||10)}};Ext.util.Event=function(E,D){this.name=D;this.obj=E;this.listeners=[]};Ext.util.Event.prototype={addListener:function(G,F,E){F=F||this.obj;if(!this.isListening(G,F)){var D=this.createListener(G,F,E);if(!this.firing){this.listeners.push(D)}else{this.listeners=this.listeners.slice(0);this.listeners.push(D)}}},createListener:function(G,F,H){H=H||{};F=F||this.obj;var D={fn:G,scope:F,options:H};var E=G;if(H.delay){E=A(E,H,F)}if(H.single){E=C(E,this,G,F)}if(H.buffer){E=B(E,H,F)}D.fireFn=E;return D},findListener:function(I,H){H=H||this.obj;var F=this.listeners;for(var G=0,D=F.length;G<D;G++){var E=F[G];if(E.fn==I&&E.scope==H){return G}}return -1},isListening:function(E,D){return this.findListener(E,D)!=-1},removeListener:function(F,E){var D;if((D=this.findListener(F,E))!=-1){if(!this.firing){this.listeners.splice(D,1)}else{this.listeners=this.listeners.slice(0);this.listeners.splice(D,1)}return true}return false},clearListeners:function(){this.listeners=[]},fire:function(){var F=this.listeners,I,D=F.length;if(D>0){this.firing=true;var G=Array.prototype.slice.call(arguments,0);for(var H=0;H<D;H++){var E=F[H];if(E.fireFn.apply(E.scope||this.obj||window,arguments)===false){this.firing=false;return false}}this.firing=false}return true}}})();