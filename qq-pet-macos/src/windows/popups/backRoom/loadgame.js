var SWF = function(){
	var _ID = 1000;
	var _SWFTEMPLATE = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="{width}" height="{height}" id="app{id}"><param name="movie" value="{swf}" /><param name="quality" value="high" /><param name="wmode" value="direct" /><param name="menu" value="false"><param name="allowScriptAccess" value="always" /><param name="base" value="{baseurl}" /><!--[if !IE]>--><object type="application/x-shockwave-flash" data="{swf}" width="{width}" height="{height}" name="app{id}"><param name="quality" value="high" /><param name="base" value="{baseurl}" /><param name="wmode" value="direct" /><param name="allowScriptAccess" value="always" /><param name="menu" value="false"><!--<![endif]--><!--[if !IE]>--></object><!--<![endif]--></object>';

	var substitute = function(str,object,regexp){
		return str.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != undefined) ? object[name] : '';
		});
	}
	var load = function(url, baseurl){
		var swfobj = {};
			swfobj.id = ++_ID;
			swfobj.width = 800;
			swfobj.height = 600;
			swfobj.swf = url;
			swfobj.baseurl = baseurl || '';
		document.write('<div style="width:800px;height:600px;position:absolute;left:0;top:0">' + substitute(_SWFTEMPLATE, swfobj) + '</div>');

	};
	return {
		'Load' : load
	}
}();
