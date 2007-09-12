Ext.namespace("Egw");var EGWNameSpace=Egw;Egw.Addressbook=function(){var G;var D;var c;var V,E;var W=function(m,R){var Q=m.getRegion("center",false);Q.remove(0);var S=Ext.Element.get("content");var Y=S.createChild({tag:"div",id:"outergriddiv"});switch(R.attributes.datatype){case "list":var h={listId:R.attributes.listId};break;case "contacts":var h={displayContacts:true,displayLists:true};break;case "otherpeople":var h={displayContacts:true,displayLists:true,};break;case "sharedaddressbooks":var h={displayContacts:true,displayLists:true,};break;}G=new Ext.data.JsonStore({url:"index.php",baseParams:{method:"Addressbook.getContacts",datatype:R.attributes.datatype,owner:R.attributes.owner,nodeid:R.attributes.id,options:Ext.encode(h),},root:"results",totalProperty:"totalcount",id:"contact_id",fields:[{name:"contact_id"},{name:"contact_tid"},{name:"contact_owner"},{name:"contact_private"},{name:"cat_id"},{name:"n_family"},{name:"n_given"},{name:"n_middle"},{name:"n_prefix"},{name:"n_suffix"},{name:"n_fn"},{name:"n_fileas"},{name:"contact_bday"},{name:"org_name"},{name:"org_unit"},{name:"contact_title"},{name:"contact_role"},{name:"contact_assistent"},{name:"contact_room"},{name:"adr_one_street"},{name:"adr_one_street2"},{name:"adr_one_locality"},{name:"adr_one_region"},{name:"adr_one_postalcode"},{name:"adr_one_countryname"},{name:"contact_label"},{name:"adr_two_street"},{name:"adr_two_street2"},{name:"adr_two_locality"},{name:"adr_two_region"},{name:"adr_two_postalcode"},{name:"adr_two_countryname"},{name:"tel_work"},{name:"tel_cell"},{name:"tel_fax"},{name:"tel_assistent"},{name:"tel_car"},{name:"tel_pager"},{name:"tel_home"},{name:"tel_fax_home"},{name:"tel_cell_private"},{name:"tel_other"},{name:"tel_prefer"},{name:"contact_email"},{name:"contact_email_home"},{name:"contact_url"},{name:"contact_url_home"},{name:"contact_freebusy_uri"},{name:"contact_calendar_uri"},{name:"contact_note"},{name:"contact_tz"},{name:"contact_geo"},{name:"contact_pubkey"},{name:"contact_created"},{name:"contact_creator"},{name:"contact_modified"},{name:"contact_modifier"},{name:"contact_jpegphoto"},{name:"account_id"}],remoteSort:true});G.setDefaultSort("contact_id","desc");G.load({params:{start:0,limit:50}});G.on("beforeload",function(T,I){T.baseParams.options=Ext.encode({displayContacts:V.pressed,displayLists:E.pressed});});var l=new Ext.grid.ColumnModel([{resizable:true,id:"contact_id",header:"Id",dataIndex:"contact_id",width:30},{resizable:true,id:"contact_tid",dataIndex:"contact_tid",width:30,renderer:u},{resizable:true,id:"n_family",header:"Family name",dataIndex:"n_family"},{resizable:true,id:"n_given",header:"Given name",dataIndex:"n_given"},{resizable:true,header:"Middle name",dataIndex:"n_middle",hidden:true},{resizable:true,id:"n_prefix",header:"Prefix",dataIndex:"n_prefix",hidden:true},{resizable:true,header:"Suffix",dataIndex:"n_suffix",hidden:true},{resizable:true,header:"Full name",dataIndex:"n_fn",hidden:true},{resizable:true,header:"Birthday",dataIndex:"contact_bday",hidden:true},{resizable:true,header:"Organisation",dataIndex:"org_name"},{resizable:true,header:"Unit",dataIndex:"org_unit"},{resizable:true,header:"Title",dataIndex:"contact_title",},{resizable:true,header:"Role",dataIndex:"contact_role",},{resizable:true,id:"addressbook",header:"addressbook",dataIndex:"addressbook",hidden:true}]);l.defaultSortable=true;D=new Ext.grid.Grid(Y,{ds:G,cm:l,autoSizeColumns:false,selModel:new Ext.grid.RowSelectionModel({multiSelect:true}),enableColLock:false,loadMask:true,enableDragDrop:true,ddGroup:"TreeDD",autoExpandColumn:"n_given"});D.render();D.on("rowclick",function(r,J,t){var I=D.getSelectionModel().getCount();var T=Z.items.map;if(I<1){T.editbtn.disable();T.deletebtn.disable();}else{if(I==1){T.editbtn.enable();T.deletebtn.enable();}else{T.editbtn.disable();T.deletebtn.enable();}}});D.on("rowdblclick",function(T,J,t){var I=T.getDataSource().getAt(J);try{w(I.data.contact_id);}catch(r){}});D.on("rowcontextmenu",function(T,t,I){I.stopEvent();i.showAt(I.getXY());});var v=D.getView().getHeaderPanel(true);var Z=new Ext.PagingToolbar(v,G,{pageSize:50,cls:"x-btn-icon-22",displayInfo:true,displayMsg:"Displaying contacts {0} - {1} of {2}",emptyMsg:"No contacts to display"});Z.insertButton(0,{id:"addbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/add-user.png",tooltip:"add new contact",handler:H});Z.insertButton(1,{id:"editbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/edit-user.png",tooltip:"edit current contact",disabled:true,handler:s});Z.insertButton(2,{id:"deletebtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/delete-user.png",tooltip:"delete selected contacts",disabled:true,handler:k});Z.insertButton(3,new Ext.Toolbar.Separator());Z.insertButton(4,{id:"addlstbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/add-users.png",tooltip:"add new list",handler:X});Z.insertButton(5,{id:"editlstbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/edit-users.png",tooltip:"edit current list",disabled:true,handler:d});Z.insertButton(6,{id:"deletelstbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/delete-users.png",tooltip:"delete selected lists",disabled:true,handler:p});Z.insertButton(7,new Ext.Toolbar.Separator());V=Z.insertButton(8,{id:"filtercontactsbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/user.png",tooltip:"display contacts",enableToggle:true,pressed:true,handler:a});E=Z.insertButton(9,{id:"filterlistsbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/users.png",tooltip:"display lists",enableToggle:true,pressed:true,handler:A});Z.insertButton(10,{id:"exportbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/file-export.png",tooltip:"export selected contacts",disabled:false,onClick:o});Q.add(new Ext.GridPanel(D));};var u=function(v,l,Z,Q,S,Y){switch(v){case "l":return "<img src='images/oxygen/16x16/actions/users.png' width='12' height='12' alt='list'/>";default:return "<img src='images/oxygen/16x16/actions/user.png' width='12' height='12' alt='contact'/>";}};var a=function(S,Q){G.reload();};var A=function(S,Q){G.reload();};var k=function(Y,Q){var Z=Array();var v=D.getSelectionModel().getSelections();for(var S=0;S<v.length;++S){Z.push(v[S].id);}N(Z,function(){EGWNameSpace.Addressbook.reload();});G.reload();};var s=function(v,Q){var Z=D.getSelectionModel().getSelections();var S=Z[0].id;w(S);};var H=function(S,Q){w();};var p=function(){};var d=function(){};var X=function(S,Q){w("list");};var i=new Ext.menu.Menu({id:"ctxMenuAddress",items:[{id:"edit",text:"edit contact",icon:"images/oxygen/22x22/actions/edit-user.png",handler:s},{id:"delete",text:"delete contact",icon:"images/oxygen/22x22/actions/delete-user.png",handler:k},"-",{id:"new",text:"new contact",icon:"images/oxygen/22x22/actions/add-user.png",handler:H}]});var o=function(S,Q){};var w=function(m){var S;var I=1024,Y=786;var Z=950,R=600;if(document.all){I=document.body.clientWidth;Y=document.body.clientHeight;x=window.screenTop;y=window.screenLeft;}else{if(window.innerWidth){I=window.innerWidth;Y=window.innerHeight;x=window.screenX;y=window.screenY;}}var v=((I-Z)/2)+y,l=((Y-R)/2)+x;if(m=="list"){S="index.php?getpopup=addressbook.editlist";}if(m){S="index.php?getpopup=addressbook.editcontact&contactid="+m;}else{S="index.php?getpopup=addressbook.editcontact";}appId="addressbook";var Q=window.open(S,"popupname","width="+Z+",height="+R+",top="+l+",left="+v+",directories=no,toolbar=no,location=no,menubar=no,scrollbars=no,status=no,resizable=no,dependent=no");return ;};var F=function(Q){Q=(Q==null)?false:Q;window.opener.EGWNameSpace.Addressbook.reload();if(Q==true){window.setTimeout("window.close()",400);}};var N=function(S,Q,Z){var v=Ext.util.JSON.encode(S);new Ext.data.Connection().request({url:"index.php",method:"post",scope:this,params:{method:"Addressbook.deleteContacts",_contactIDs:v},success:function(l,m){var Y;try{Y=Ext.util.JSON.decode(l.responseText);if(Y.success){if(typeof Q=="function"){Q;}}else{Ext.MessageBox.alert("Failure!","Deleting contact failed!");}}catch(R){Ext.MessageBox.alert("Failure!",R.message);}},failure:function(Y,l){}});};var K=function(S,Q){Ext.MessageBox.alert("Export","Not yet implemented.");};var C=function(){};var e=function(){Ext.QuickTips.init();Ext.form.Field.prototype.msgTarget="side";var v=new Ext.BorderLayout(document.body,{north:{split:false,initialSize:28},center:{autoScroll:true}});v.beginUpdate();v.add("north",new Ext.ContentPanel("header",{fitToFrame:true}));v.add("center",new Ext.ContentPanel("content"));v.endUpdate();var h=true;if(formData.values){h=false;}var S=new Ext.Toolbar("header");S.add({id:"savebtn",cls:"x-btn-text-icon",text:"Save and Close",icon:"images/oxygen/22x22/actions/document-save.png",tooltip:"save this contact and close window",onClick:function(){if(Z.isValid()){var I={};if(formData.values){I._contactID=formData.values.contact_id;}else{I._contactID=0;}Z.submit({waitTitle:"Please wait!",waitMsg:"saving contact...",params:I,success:function(T,t,J){window.opener.EGWNameSpace.Addressbook.reload();window.setTimeout("window.close()",400);},failure:function(T,t){}});}else{Ext.MessageBox.alert("Errors","Please fix the errors noted.");}}},{id:"savebtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/save-all.png",tooltip:"apply changes for this contact",onClick:function(){if(Z.isValid()){var I={};if(formData.values){I._contactID=formData.values.contact_id;}else{I._contactID=0;}Z.submit({waitTitle:"Please wait!",waitMsg:"saving contact...",params:I,success:function(T,t,J){window.opener.EGWNameSpace.Addressbook.reload();},failure:function(T,t){}});}else{Ext.MessageBox.alert("Errors","Please fix the errors noted.");}}},{id:"deletebtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/edit-delete.png",tooltip:"delete this contact",disabled:h,handler:function(T,I){if(formData.values.contact_id){Ext.MessageBox.wait("Deleting contact...","Please wait!");N([formData.values.contact_id]);F(true);}}},{id:"exportbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/file-export.png",tooltip:"export this contact",disabled:h,handler:K});var m=new Ext.data.JsonStore({url:"index.php",baseParams:{method:"Egwbase.getCountryList"},root:"results",id:"shortName",fields:["shortName","translatedName"],remoteSort:false});var Y=new Ext.data.SimpleStore({fields:["id","addressbooks"],data:formData.config.addressbooks});var Q=Ext.Element.get("content");var Z=new Ext.form.Form({labelWidth:75,url:"index.php?method=Addressbook.saveAddress",reader:new Ext.data.JsonReader({root:"results"},[{name:"contact_id"},{name:"contact_tid"},{name:"contact_owner"},{name:"contact_private"},{name:"cat_id"},{name:"n_family"},{name:"n_given"},{name:"n_middle"},{name:"n_prefix"},{name:"n_suffix"},{name:"n_fn"},{name:"n_fileas"},{name:"contact_bday"},{name:"org_name"},{name:"org_unit"},{name:"contact_title"},{name:"contact_role"},{name:"contact_assistent"},{name:"contact_room"},{name:"adr_one_street"},{name:"adr_one_street2"},{name:"adr_one_locality"},{name:"adr_one_region"},{name:"adr_one_postalcode"},{name:"adr_one_countryname"},{name:"contact_label"},{name:"adr_two_street"},{name:"adr_two_street2"},{name:"adr_two_locality"},{name:"adr_two_region"},{name:"adr_two_postalcode"},{name:"adr_two_countryname"},{name:"tel_work"},{name:"tel_cell"},{name:"tel_fax"},{name:"tel_assistent"},{name:"tel_car"},{name:"tel_pager"},{name:"tel_home"},{name:"tel_fax_home"},{name:"tel_cell_private"},{name:"tel_other"},{name:"tel_prefer"},{name:"contact_email"},{name:"contact_email_home"},{name:"contact_url"},{name:"contact_url_home"},{name:"contact_freebusy_uri"},{name:"contact_calendar_uri"},{name:"contact_note"},{name:"contact_tz"},{name:"contact_geo"},{name:"contact_pubkey"},{name:"contact_created"},{name:"contact_creator"},{name:"contact_modified"},{name:"contact_modifier"},{name:"contact_jpegphoto"},{name:"account_id"}])});Z.on("beforeaction",function(T,I){T.baseParams={};T.baseParams._contactOwner=T.getValues().contact_owner;if(formData.values&&formData.values.contact_id){T.baseParams._contactID=formData.values.contact_id;}else{T.baseParams._contactID=0;}console.log(T.baseParams);});Z.fieldset({legend:"Contact information"});Z.column({width:"33%",labelWidth:90,labelSeparator:""},new Ext.form.TextField({fieldLabel:"First Name",name:"n_given",width:175}),new Ext.form.TextField({fieldLabel:"Middle Name",name:"n_middle",width:175}),new Ext.form.TextField({fieldLabel:"Last Name",name:"n_family",width:175,allowBlank:false}));Z.column({width:"33%",labelWidth:90,labelSeparator:""},new Ext.form.TextField({fieldLabel:"Prefix",name:"n_prefix",width:175}),new Ext.form.TextField({fieldLabel:"Suffix",name:"n_suffix",width:175}),new Ext.form.ComboBox({fieldLabel:"Addressbook",name:"contact_owner",hiddenName:"contact_owner",store:Y,displayField:"addressbooks",valueField:"id",typeAhead:true,mode:"remote",triggerAction:"all",emptyText:"Select a addressbook...",selectOnFocus:true,width:175}));Z.end();Z.fieldset({legend:"Business information"});Z.column({width:"33%",labelWidth:90,labelSeparator:""},new Ext.form.TextField({fieldLabel:"Company",name:"org_name",width:175}),new Ext.form.TextField({fieldLabel:"Street",name:"adr_one_street",width:175}),new Ext.form.TextField({fieldLabel:"Street 2",name:"adr_one_street2",width:175}),new Ext.form.TextField({fieldLabel:"Postalcode",name:"adr_one_postalcode",width:175}),new Ext.form.TextField({fieldLabel:"City",name:"adr_one_locality",width:175}),new Ext.form.TextField({fieldLabel:"Region",name:"adr_one_region",width:175}),new Ext.form.ComboBox({fieldLabel:"Country",name:"adr_one_countryname",hiddenName:"adr_one_countryname",store:m,displayField:"translatedName",valueField:"shortName",typeAhead:true,mode:"remote",triggerAction:"all",emptyText:"Select a state...",selectOnFocus:true,width:175}));Z.column({width:"33%",labelWidth:90,labelSeparator:""},new Ext.form.TextField({fieldLabel:"Phone",name:"tel_work",width:175}),new Ext.form.TextField({fieldLabel:"Cellphone",name:"tel_cell",width:175}),new Ext.form.TextField({fieldLabel:"Fax",name:"tel_fax",width:175}),new Ext.form.TextField({fieldLabel:"Car phone",name:"tel_car",width:175}),new Ext.form.TextField({fieldLabel:"Pager",name:"tel_pager",width:175}),new Ext.form.TextField({fieldLabel:"Email",name:"contact_email",vtype:"email",width:175}),new Ext.form.TextField({fieldLabel:"URL",name:"contact_url",vtype:"url",width:175}));Z.column({width:"33%",labelWidth:90,labelSeparator:""},new Ext.form.TextField({fieldLabel:"Unit",name:"org_unit",width:175}),new Ext.form.TextField({fieldLabel:"Role",name:"contact_role",width:175}),new Ext.form.TextField({fieldLabel:"Title",name:"contact_title",width:175}),new Ext.form.TextField({fieldLabel:"Room",name:"contact_room",width:175}),new Ext.form.TextField({fieldLabel:"Name Assistent",name:"contact_assistent",width:175}),new Ext.form.TextField({fieldLabel:"Phone Assistent",name:"tel_assistent",width:175}));Z.end();Z.fieldset({legend:"Private information"});Z.column({width:"33%",labelWidth:90,labelSeparator:""},new Ext.form.TextField({fieldLabel:"Street",name:"adr_two_street",width:175}),new Ext.form.TextField({fieldLabel:"Street2",name:"adr_two_street2",width:175}),new Ext.form.TextField({fieldLabel:"Postalcode",name:"adr_two_postalcode",width:175}),new Ext.form.TextField({fieldLabel:"City",name:"adr_two_locality",width:175}),new Ext.form.TextField({fieldLabel:"Region",name:"adr_two_region",width:175}),new Ext.form.ComboBox({fieldLabel:"Country",name:"adr_two_countryname",hiddenName:"adr_two_countryname",store:m,displayField:"translatedName",valueField:"shortName",typeAhead:true,mode:"remote",triggerAction:"all",emptyText:"Select a state...",selectOnFocus:true,width:175}));Z.column({width:"33%",labelWidth:90,labelSeparator:""},new Ext.form.DateField({fieldLabel:"Birthday",name:"contact_bday",format:formData.config.dateFormat,altFormats:"Y-m-d",width:175}),new Ext.form.TextField({fieldLabel:"Phone",name:"tel_home",width:175}),new Ext.form.TextField({fieldLabel:"Cellphone",name:"tel_cell_private",width:175}),new Ext.form.TextField({fieldLabel:"Fax",name:"tel_fax_home",width:175}),new Ext.form.TextField({fieldLabel:"Email",name:"contact_email_home",vtype:"email",width:175}),new Ext.form.TextField({fieldLabel:"URL",name:"contact_url_home",vtype:"url",width:175}));Z.column({width:"33%",labelSeparator:"",hideLabels:true},new Ext.form.TextArea({name:"contact_note",grow:false,preventScrollbars:false,width:"95%",maxLength:255,height:150}));Z.end();var R=new Ext.form.TriggerField({fieldLabel:"Categories",name:"categories",width:320,readOnly:true});R.onTriggerClick=function(){var r=Ext.Element.get("container");var b=r.createChild({tag:"div",id:"iWindowTag"});var O=r.createChild({tag:"div",id:"iWindowContTag"});var I=new Ext.data.SimpleStore({fields:["category_id","category_realname"],data:[["1","erste Kategorie"],["2","zweite Kategorie"],["3","dritte Kategorie"],["4","vierte Kategorie"],["5","fuenfte Kategorie"],["6","sechste Kategorie"],["7","siebte Kategorie"],["8","achte Kategorie"]]});I.load();ds_checked=new Ext.data.SimpleStore({fields:["category_id","category_realname"],data:[["2","zweite Kategorie"],["5","fuenfte Kategorie"],["6","sechste Kategorie"],["8","achte Kategorie"]]});ds_checked.load();var f=new Ext.form.Form({labelWidth:75,url:"index.php?method=Addressbook.saveAdditionalData",reader:new Ext.data.JsonReader({root:"results"},[{name:"category_id"},{name:"category_realname"},])});var T=1;var q=new Array();ds_checked.each(function(B){q[B.data.category_id]=B.data.category_realname;});I.each(function(B){if((T%12)==1){f.column({width:"33%",labelWidth:50,labelSeparator:""});}if(q[B.data.category_id]){f.add(new Ext.form.Checkbox({boxLabel:B.data.category_realname,name:B.data.category_realname,checked:true}));}else{f.add(new Ext.form.Checkbox({boxLabel:B.data.category_realname,name:B.data.category_realname}));}if((T%12)==0){f.end();}T=T+1;});f.render("iWindowContTag");if(!J){var J=new Ext.LayoutDialog("iWindowTag",{modal:true,width:700,height:400,shadow:true,minWidth:700,minHeight:400,autoTabs:true,proxyDrag:true,center:{autoScroll:true,tabPosition:"top",closeOnTab:true,alwaysShowTabs:true}});J.addKeyListener(27,this.hide);J.addButton("save",function(){Ext.MessageBox.alert("Todo","Not yet implemented!");J.hide;},J);J.addButton("cancel",function(){Ext.MessageBox.alert("Todo","Not yet implemented!");J.hide;},J);var t=J.getLayout();t.beginUpdate();t.add("center",new Ext.ContentPanel("iWindowContTag",{autoCreate:true,title:"Category"}));t.endUpdate();}J.show();};Z.column({width:"45%",labelWidth:80,labelSeparator:" ",labelAlign:"right"},R);var l=new Ext.form.TriggerField({fieldLabel:"Lists",name:"lists",width:320,readOnly:true});l.onTriggerClick=function(){var r=Ext.Element.get("container");var b=r.createChild({tag:"div",id:"iWindowTag"});var O=r.createChild({tag:"div",id:"iWindowContTag"});var I=new Ext.data.SimpleStore({fields:["list_id","list_realname"],data:[["1","Liste A"],["2","Liste B"],["3","Liste C"],["4","Liste D"],["5","Liste E"],["6","Liste F"],["7","Liste G"],["8","Liste H"]]});I.load();ds_checked=new Ext.data.SimpleStore({fields:["list_id","list_realname"],data:[["2","Liste B"],["5","Liste E"],["6","Liste F"],["8","Liste H"]]});ds_checked.load();var f=new Ext.form.Form({labelWidth:75,url:"index.php?method=Addressbook.saveAdditionalData",reader:new Ext.data.JsonReader({root:"results"},[{name:"list_id"},{name:"list_realname"},])});var T=1;var q=new Array();ds_checked.each(function(B){q[B.data.list_id]=B.data.list_realname;});I.each(function(B){if((T%12)==1){f.column({width:"33%",labelWidth:50,labelSeparator:""});}if(q[B.data.list_id]){f.add(new Ext.form.Checkbox({boxLabel:B.data.list_realname,name:B.data.list_realname,checked:true}));}else{f.add(new Ext.form.Checkbox({boxLabel:B.data.list_realname,name:B.data.list_realname}));}if((T%12)==0){f.end();}T=T+1;});f.render("iWindowContTag");if(!J){var J=new Ext.LayoutDialog("iWindowTag",{modal:true,width:700,height:400,shadow:true,minWidth:700,minHeight:400,autoTabs:true,proxyDrag:true,center:{autoScroll:true,tabPosition:"top",closeOnTab:true,alwaysShowTabs:true}});J.addKeyListener(27,this.hide);J.addButton("save",function(){Ext.MessageBox.alert("Todo","Not yet implemented!");},J);J.addButton("cancel",function(){window.location.reload();J.hide;},J);var t=J.getLayout();t.beginUpdate();t.add("center",new Ext.ContentPanel("iWindowContTag",{autoCreate:true,title:"Lists"}));t.endUpdate();}J.show();};Z.column({width:"45%",labelWidth:80,labelSeparator:" ",labelAlign:"right"},l);Z.column({width:"10%",labelWidth:50,labelSeparator:" ",labelAlign:"right"},new Ext.form.Checkbox({fieldLabel:"Private",name:"categories",width:10}));Z.render("content");return Z;};var C=function(){Ext.QuickTips.init();Ext.form.Field.prototype.msgTarget="side";var Z=new Ext.BorderLayout(document.body,{north:{split:false,initialSize:28},center:{autoScroll:true}});Z.beginUpdate();Z.add("north",new Ext.ContentPanel("header",{fitToFrame:true}));Z.add("center",new Ext.ContentPanel("content"));Z.endUpdate();var v=true;if(formData.values){v=false;}var Q=new Ext.Toolbar("header");Q.add({id:"savebtn",cls:"x-btn-text-icon",text:"Save and Close",icon:"images/oxygen/22x22/actions/document-save.png",tooltip:"save this contact and close window",onClick:function(){if(Y.isValid()){Y.submit({waitTitle:"Please wait!",waitMsg:"saving contact...",params:additionalData,success:function(m,R,h){window.opener.EGWNameSpace.Addressbook.reload();window.setTimeout("window.close()",400);},failure:function(m,R){}});}else{Ext.MessageBox.alert("Errors","Please fix the errors noted.");}}},{id:"savebtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/save-all.png",tooltip:"apply changes for this contact",onClick:function(){if(Y.isValid()){var m={};if(formData.values){m._contactID=formData.values.contact_id;}else{m._contactID=0;}Y.submit({waitTitle:"Please wait!",waitMsg:"saving contact...",params:m,success:function(R,h,I){window.opener.EGWNameSpace.Addressbook.reload();},failure:function(R,h){}});}else{Ext.MessageBox.alert("Errors","Please fix the errors noted.");}}},{id:"deletebtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/edit-delete.png",tooltip:"delete this contact",disabled:v,handler:function(R,m){if(formData.values.contact_id){Ext.MessageBox.wait("Deleting contact...","Please wait!");N([formData.values.contact_id]);F(true);}}},{id:"exportbtn",cls:"x-btn-icon-22",icon:"images/oxygen/22x22/actions/file-export.png",tooltip:"export this contact",disabled:v,handler:K});var l=new Ext.data.JsonStore({url:"index.php",baseParams:{method:"Egwbase.getCountryList"},root:"results",id:"shortName",fields:["shortName","translatedName"],remoteSort:false});var S=Ext.Element.get("content");var Y=new Ext.form.Form({labelWidth:75,url:"index.php?method=Addressbook.saveList",reader:new Ext.data.JsonReader({root:"results"},[{name:"list_id"},{name:"list_name"},{name:"list_owner"},{name:"list_created"},{name:"list_creator"}])});Y.fieldset({legend:"List information"});Y.column({width:"33%",labelWidth:90,labelSeparator:""},new Ext.form.TextField({fieldLabel:"List Name",name:"list_name",width:175}),new Ext.form.TextField({fieldLabel:"List Owner",name:"list_owner",width:175}));Y.end();Y.render("content");return Y;};var M=function(S,Z){for(var v in Z){var Q=S.findField(v);if(Q){Q.setValue(Z[v]);}}};return {show:W,reload:function(){G.reload();},handleDragDrop:function(Q){alert("Best Regards From Addressbook");},openDialog:function(){w();},displayContactDialog:function(){var Q=e();if(formData.values){M(Q,formData.values);}},displayListDialog:function(){var Q=C();if(formData.values){M(Q,formData.values);}}};}();