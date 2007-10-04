/*
 * Ext JS Library 2.0 Alpha 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.Window=Ext.extend(Ext.Panel,{baseCls:"x-window",resizable:true,draggable:true,closable:true,constrain:false,constrainHeader:false,plain:false,minimizable:false,maximizable:false,minHeight:100,minWidth:200,expandOnShow:true,closeAction:"close",collapsible:false,initHidden:true,monitorResize:true,elements:"header,body",frame:true,floating:true,initComponent:function(){Ext.Window.superclass.initComponent.call(this);this.addEvents({resize:true,maximize:true,minimize:true,restore:true})},getState:function(){return Ext.apply(Ext.Window.superclass.getState.call(this)||{},this.getBox())},onRender:function(B,A){Ext.Window.superclass.onRender.call(this,B,A);if(this.plain){this.el.addClass("x-window-plain")}this.focusEl=this.el.createChild({tag:"a",href:"#",cls:"x-dlg-focus",tabIndex:"-1",html:"&#160;"});this.focusEl.swallowEvent("click",true);this.proxy=this.el.createProxy("x-window-proxy");this.proxy.enableDisplayMode("block");if(this.modal){this.mask=this.container.createChild({cls:"ext-el-mask"},this.el.dom);this.mask.enableDisplayMode("block");this.mask.hide()}},initEvents:function(){Ext.Window.superclass.initEvents.call(this);if(this.animateTarget){this.setAnimateTarget(this.animateTarget)}if(this.resizable){this.resizer=new Ext.Resizable(this.el,{minWidth:this.minWidth,minHeight:this.minHeight,handles:this.resizeHandles||"all",pinned:true,resizeElement:this.resizerAction});this.resizer.window=this;this.resizer.on("beforeresize",this.beforeResize,this)}if(this.draggable){this.header.addClass("x-window-draggable")}this.initTools();this.el.on("mousedown",this.toFront,this);this.manager=this.manager||Ext.WindowMgr;this.manager.register(this);this.hidden=true;if(this.maximized){this.maximized=false;this.maximize()}if(this.closable){var A=this.getKeyMap();A.on(27,this.onEsc,this);A.disable()}},initDraggable:function(){this.dd=new Ext.Window.DD(this)},onEsc:function(){this[this.closeAction]()},onDestroy:function(){if(this.manager){this.manager.unregister(this)}Ext.destroy(this.resizer,this.dd,this.proxy);Ext.Window.superclass.onDestroy.call(this)},initTools:function(){if(this.minimizable){this.addTool({id:"minimize",handler:this.minimize.createDelegate(this,[])})}if(this.maximizable){this.addTool({id:"maximize",handler:this.maximize.createDelegate(this,[])});this.addTool({id:"restore",handler:this.restore.createDelegate(this,[]),hidden:true});this.header.on("dblclick",this.toggleMaximize,this)}if(this.closable){this.addTool({id:"close",handler:this[this.closeAction].createDelegate(this,[])})}},resizerAction:function(){var A=this.proxy.getBox();this.proxy.hide();this.window.handleResize(A);return A},beforeResize:function(){this.resizer.minHeight=Math.max(this.minHeight,this.getFrameHeight()+40);this.resizer.minWidth=Math.max(this.minWidth,this.getFrameWidth()+40);this.resizeBox=this.el.getBox()},updateHandles:function(){if(Ext.isIE&&this.resizer){this.resizer.syncHandleHeight();this.el.repaint()}},handleResize:function(B){var A=this.resizeBox;if(A.x!=B.x||A.y!=B.y){this.updateBox(B)}else{this.setSize(B)}this.focus();this.updateHandles();this.saveState();this.fireEvent("resize",this,B.width,B.height)},focus:function(){this.focusEl.focus.defer(10,this.focusEl)},setAnimateTarget:function(A){A=Ext.get(A);this.animateTarget=A},beforeShow:function(){delete this.el.lastXY;delete this.el.lastLT;if(this.x===undefined||this.y===undefined){var A=this.el.getAlignToXY(this.container,"c-c");var B=this.el.translatePoints(A[0],A[1]);this.x=this.x===undefined?B.left:this.x;this.y=this.y===undefined?B.top:this.y}this.el.setLeftTop(this.x,this.y);if(this.expandOnShow){this.expand(false)}if(this.modal){Ext.getBody().addClass("x-body-masked");this.mask.setSize(Ext.lib.Dom.getViewWidth(true),Ext.lib.Dom.getViewHeight(true));this.mask.show()}},show:function(C,A,B){if(!this.rendered){this.render(Ext.getBody())}if(this.hidden===false){this.toFront();return }if(this.fireEvent("beforeshow",this)===false){return }if(A){this.on("show",A,B,{single:true})}this.hidden=false;if(C!==undefined){this.setAnimateTarget(C)}this.beforeShow();if(this.animateTarget){this.animShow()}else{this.afterShow()}},afterShow:function(){this.proxy.hide();this.el.setStyle("display","block");this.el.show();if(this.maximized){this.fitContainer()}if(this.monitorResize&&(this.constrain||this.constrainHeader)){Ext.EventManager.onWindowResize(this.onWindowResize,this);this.doConstrain()}if(this.layout){this.doLayout()}if(this.keyMap){this.keyMap.enable()}this.toFront();this.updateHandles();this.fireEvent("show",this)},animShow:function(){this.proxy.show();this.proxy.setBox(this.animateTarget.getBox());this.proxy.setOpacity(0);var A=this.getBox(false);A.callback=this.afterShow;A.scope=this;A.duration=0.25;A.easing="easeNone";A.opacity=0.5;A.block=true;this.el.setStyle("display","none");this.proxy.shift(A)},hide:function(C,A,B){if(this.hidden||this.fireEvent("beforehide",this)===false){return }if(A){this.on("hide",A,B,{single:true})}this.hidden=true;if(C!==undefined){this.setAnimateTarget(C)}if(this.animateTarget){this.animHide()}else{this.el.hide();this.afterHide()}},afterHide:function(){this.proxy.hide();if(this.monitorResize&&(this.constrain||this.constrainHeader)){Ext.EventManager.removeResizeListener(this.onWindowResize,this)}if(this.modal){this.mask.hide();Ext.getBody().removeClass("x-body-masked")}if(this.keyMap){this.keyMap.disable()}this.fireEvent("hide",this)},animHide:function(){this.proxy.setOpacity(0.5);this.proxy.show();var B=this.getBox(false);this.proxy.setBox(B);this.el.hide();var A=this.animateTarget.getBox();A.callback=this.afterHide;A.scope=this;A.duration=0.25;A.easing="easeNone";A.block=true;A.opacity=0;this.proxy.shift(A)},onWindowResize:function(){if(this.maximized){this.fitContainer()}this.doConstrain()},doConstrain:function(){if(this.constrain||this.constrainHeader){var B;if(this.constrain){B={right:this.el.shadowOffset,left:this.el.shadowOffset,bottom:this.el.shadowOffset}}else{var A=this.getSize();B={right:-(A.width-100),bottom:-(A.height-25)}}var C=this.el.getConstrainToXY(this.container,true,B);if(C){this.setPosition(C[0],C[1])}}},ghost:function(A){var C=this.createGhost(A);var B=this.getBox(true);C.setLeftTop(B.x,B.y);C.setWidth(B.width);this.el.hide();this.activeGhost=C;return C},unghost:function(B,A){if(B!==false){this.el.show();this.focus()}if(A!==false){this.setPosition(this.activeGhost.getLeft(true),this.activeGhost.getTop(true))}this.activeGhost.hide();this.activeGhost.remove();delete this.activeGhost},minimize:function(){this.fireEvent("minimize",this)},close:function(){if(this.fireEvent("beforeclose",this)!==false){this.hide(null,function(){this.fireEvent("close",this);this.destroy()},this)}},maximize:function(){if(!this.maximized){this.expand(false);this.restoreSize=this.getSize();this.restorePos=this.getPosition(true);this.tools.maximize.hide();this.tools.restore.show();this.maximized=true;this.el.disableShadow();if(this.dd){this.dd.lock()}if(this.collapsible){this.tools.toggle.hide()}this.el.addClass("x-window-maximized");this.container.addClass("x-window-maximized-ct");this.setPosition(0,0);this.fitContainer();this.fireEvent("maximize",this)}},restore:function(){if(this.maximized){this.el.removeClass("x-window-maximized");this.tools.restore.hide();this.tools.maximize.show();this.setPosition(this.restorePos[0],this.restorePos[1]);this.setSize(this.restoreSize.width,this.restoreSize.height);delete this.restorePos;delete this.restoreSize;this.maximized=false;this.el.enableShadow(true);if(this.dd){this.dd.unlock()}if(this.collapsible){this.tools.toggle.show()}this.container.removeClass("x-window-maximized-ct");this.doConstrain();this.fireEvent("restore",this)}},toggleMaximize:function(){this[this.maximized?"restore":"maximize"]()},fitContainer:function(){var A=this.container.getViewSize();this.setSize(A.width,A.height)},setZIndex:function(A){if(this.modal){this.mask.setStyle("z-index",A)}this.el.setZIndex(++A);A+=5;if(this.resizer){this.resizer.proxy.setStyle("z-index",++A)}this.lastZIndex=A},alignTo:function(B,A,C){var D=this.el.getAlignToXY(B,A,C);this.setPagePosition(D[0],D[1]);return this},anchorTo:function(C,F,D,B){var E=function(){this.alignTo(C,F,D)};Ext.EventManager.onWindowResize(E,this);var A=typeof B;if(A!="undefined"){Ext.EventManager.on(window,"scroll",E,this,{buffer:A=="number"?B:50})}E.call(this);return this},toFront:function(){if(this.manager.bringToFront(this)){this.focus()}return this},setActive:function(A){if(A){if(!this.maximized){this.el.enableShadow(true)}this.fireEvent("activate",this)}else{this.el.disableShadow();this.fireEvent("deactivate",this)}},toBack:function(){this.manager.sendToBack(this);return this},center:function(){var A=this.el.getAlignToXY(this.container,"c-c");this.setPagePosition(A[0],A[1]);return this}});Ext.reg("window",Ext.Window);Ext.Window.DD=function(A){this.win=A;Ext.Window.DD.superclass.constructor.call(this,A.el.id,"WindowDD-"+A.id);this.setHandleElId(A.header.id);this.scroll=false};Ext.extend(Ext.Window.DD,Ext.dd.DD,{moveOnly:true,headerOffsets:[100,25],startDrag:function(){var A=this.win;this.proxy=A.ghost();if(A.constrain!==false){var C=A.el.shadowOffset;this.constrainTo(A.container,{right:C,left:C,bottom:C})}else{if(A.constrainHeader!==false){var B=this.proxy.getSize();this.constrainTo(A.container,{right:-(B.width-this.headerOffsets[0]),bottom:-(B.height-this.headerOffsets[1])})}}},b4Drag:Ext.emptyFn,onDrag:function(A){this.alignElWithMouse(this.proxy,A.getPageX(),A.getPageY())},endDrag:function(A){this.win.unghost();this.win.saveState()}});