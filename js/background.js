/*
  1.获取localstorage数据
  2.当前页面地址是否命中ls中数据

 */
var _CFMode ='cf#',//经典模式

    _TCMode ='editor.html',//触屏模式

    _WCMMode='siteadmin#',//wcm

    _OptionPage = {tab:null,status:false},//保存已打开的option.html
    //获取当前扩展的配置数据
    _ExtOption =localStorage.AEMOptions?JSON.parse(localStorage.AEMOptions):{},

    //获取当前扩展中保存的站点数据,关于此数据的格式请参照 JSON/SiteOption_example.json
    _SiteOption='siteData' in _ExtOption?_ExtOption.siteData:[],

    //背景页需要组装的数据，与当前站点相关
    _BgOption = {siteData:_SiteOption,optionsChecked:true};

//创建延迟对象
var  getDeferred=function($){

    var def = $.Deferred();

    return function(){

        return def;
    }

}(jQuery);

//$.cookie("ObFormLoginCookie","wh%3Dsso-prod2%20wu%3D%2Fautho%2Ffed%2Finternal%2Fidpredirect.html%3FresumePath%3D%252Fidp%252FKCVcq%252FresumeSAML20%252Fidp%252FSSO.ping%20wo%3D1%20rh%3Dhttps%3A%2F%2Fsso.cisco.com%20ru%3D%252Fautho%252Ffed%252Finternal%252Fidpredirect.html%20rq%3DresumePath%253D%25252Fidp%25252FKCVcq%25252FresumeSAML20%25252Fidp%25252FSSO.ping")
//$.cookie('ObSSOCookie','loggedoutcontinue')

//todo:bug 平台登录
//$.ajax({
//    url:'https://rally1.rallydev.com/#/27014070531d/custom/30067539839',
//    type:'post',
//    data:{userid:'xiaoyden',password:'Mar!2016'},
//    beforeSend:function(xhr){
//        //xhr.setRequestHeader('Cookie','ObFormLoginCookie=wh%3Dsso-prod2%20wu%3D%2Fautho%2Ffed%2Finternal%2Fidpredirect.html%3FresumePath%3D%252Fidp%252FKCVcq%252FresumeSAML20%252Fidp%252FSSO.ping%20wo%3D1%20rh%3Dhttps%3A%2F%2Fsso.cisco.com%20ru%3D%252Fautho%252Ffed%252Finternal%252Fidpredirect.html%20rq%3DresumePath%253D%25252Fidp%25252FKCVcq%25252FresumeSAML20%25252Fidp%25252FSSO.ping; ObSSOCookie=loggedoutcontinue')
//    }
//}).complete(function(xhr){
//    console.log(arguments)
//})




//序列化url
function serializeURL(url){
   //获取url基本结构
   var urlReg1 = /(http(?:s)?)\:\/\/(?:([^\:\/]*)(?:\:(\d*))?)(?:\/(cf#|editor\.html)?)?(?:\/([^?#]+))*/,
   //获取查询字段
       urlReg2 = /\?([^#]*)/,
   //获取hash值
       urlReg3 = /#([^#]*)/;
   //序列化url
   var urlPath =  url.match(urlReg1),
       urlQuery = url.match(urlReg2),
       urlHash =  url.match(urlReg3);
   var _o = !urlPath?null:{
       hash:urlHash?urlHash[1]:'',
       query:urlQuery?urlQuery[1]:'',
       href:url,
       hostname:urlPath[2]||'',//主机名
       type:urlPath[4]||'',//当前页面的编辑模式 editor.html / cf#
       port:urlPath[3]||'',//端口
       protocol:urlPath[1]||'',//地址协议
       path:urlPath[5]||''//路径
   };
   return _o;
}

function checkURL(tab){//检测当前页面url地址是否匹配设置地址，并返回设置项
    var obj  = serializeURL(tab.url);

    if(obj){//如果当前地址为空
      //console.log(obj)
      _BgOption.tab = tab;//保存当前活动tab页的info
      _BgOption.location = obj;//保存当前页面的地址对象
      if(_BgOption.siteData){
          for(var i =0;i<_BgOption.siteData.length;i++){
              var site_info = _BgOption.siteData[i];
              for(var j=0;j<site_info.siteHost.length;j++){
                if(obj.path.indexOf(site_info.sitePath.replace(/^\//,''))>-1){//命中站点路径
                  if(site_info.siteHost[j].BL.indexOf(obj.hostname)>-1){//命中BL
                      site_info.siteHost[j].highlight='BL';
                      break;
                  }
                  if(site_info.siteHost[j].LP.indexOf(obj.hostname)>-1){//命中LP
                      site_info.siteHost[j].highlight='LP';
                      break;
                  }
                }

              }
          }

      }



    }

}

function browserAction(id,status){//是否禁用此插件
    if(!status){
      chrome.browserAction.disable(id);
    }else{
      chrome.browserAction.enable(id);
    }
}

//捕获当前活动窗口
function updateActiveWindow(){


    //当窗口更新时,获取到窗口
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        //确定tab update是当前的可视窗口
        if(changeInfo.status==='loading'&&('url' in tab)&&tab.active){
            var obj  = serializeURL(tab.url);
            if(obj) {//如果当前地址为空
                if (obj.type == 'editor.html' && _BgOption.optionsChecked) {//自动切换触屏模式到经典模式
                    chrome.tabs.update(tab.id, {url: obj.href.replace('editor.html', 'cf#')});
                }
            }
        }
        // todo: need test
        if(!_OptionPage.status){
            _OptionPage.tab = tab;
        }else{
            if(tab.id===_OptionPage.tab.id&&tab.windowId===_OptionPage.tab.windowId){//同位置窗口
                if(tab.url !== _OptionPage.tab.url){//地址已经改变
                    _OptionPage.status =false;
                    _OptionPage.tab = tab;
                }
            }
        }
    });
    //切换tab时触发,需要获取tab对象
    //chrome.tabs.onActivated.addListener(function(activeInfo){
    //    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    //        checkURL(tabs[0]);
    //    });
    //})


}

updateActiveWindow();

//获取popup进行通信，发送相关配置数据
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
        console.log(msg)
        if(msg.type === 'init'){
            //AEMOptions会动态插入数据，所以每次都要获取
            console.log('init');
            _ExtOption =localStorage.AEMOptions?JSON.parse(localStorage.AEMOptions):{};
            _SiteOption='siteData' in _ExtOption?_ExtOption.siteData:[];
            _BgOption.siteData=_SiteOption;
            //_BgOption.optionPage = _OptionPage;//保存设置页面
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                checkURL(tabs[0]);
                port.postMessage({type:'init',data:_BgOption});
            });
        }else if(msg.type==='option_open'){//option.html打开
            _OptionPage.status = true;
        }else if(msg.type==='option_close'){//option.html打开
            _OptionPage.status = false;
        }else if(msg.type==='popup_need_open_option_page'){//打开设置页面
            var _update,
                _windowId,
                _id;
            if(_OptionPage.status){
                _update = {active:true};
            }else{
                _update = {url:'../option.html'};
            }
            if(_OptionPage.tab){
                chrome.windows.update(_OptionPage.tab.windowId, {focused:true}, function (data){
                    console.log(data)
                    chrome.tabs.update(_OptionPage.tab.id,_update);

                })
            }else{
                chrome.tabs.create({url:'../option.html'})
            }

        }
  });
});
