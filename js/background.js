/*
  1.获取localstorage数据
  2.当前页面地址是否命中ls中数据
  3.1.如果命中在popup中进行反馈
  3.2.如果没有命中则解析地址询问是否添加
 */
var _CFMode ='cf#',//经典模式

    _TCMode ='editor.html',//触屏模式

    _WCMMode='siteadmin#',//wcm

    //获取当前扩展的配置数据
    _ExtOption =localStorage.AEMOptions?JSON.parse(localStorage.AEMOptions):{},

    //获取当前扩展中保存的站点数据,关于此数据的格式请参照 JSON/SiteOption_example.json
    _SiteOption='siteData' in _ExtOption?_ExtOption.siteData:[],

    //背景页需要组装的数据，与当前站点相关
    _BgOption = {siteData:_SiteOption,optionsChecked:true};

//序列化url
function serializeURL(url){//序列化url
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
    console.log('tab changed!')
    if(obj){//如果当前地址为空
      if(obj.type=='editor.html'&&_BgOption.optionsChecked){//自动切换触屏模式到经典模式
          chrome.tabs.update(tab.id, {url: obj.href.replace('editor.html','cf#')});
      }
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

function activateTabChange(tab){//始终只获取当前活动的窗口
    checkURL(tab);
}

function browserAction(id,status){//是否禁用此插件
    if(!status){
      chrome.browserAction.disable(id);
    }else{
      chrome.browserAction.enable(id);
    }
}

//{.....开始捕获当前活动窗口
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    activateTabChange&&activateTabChange(tabs[0]);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {//当窗口更新时,获取到窗口
  //确定tab update是当前的可视窗口
  if(changeInfo.status==='loading'&&('url' in tab)&&tab.active){
    activateTabChange&&activateTabChange(tab);
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo){//切换tab时触发,需要获取tab对象
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      activateTabChange&&activateTabChange(tabs[0]);
  });
})
//捕获结束....}

//获取popup进行通信，发送相关配置数据
chrome.extension.onConnect.addListener(function(port) {

  port.onMessage.addListener(function(msg) {
      console.log('################')
        if(msg.type === 'init'){
            port.postMessage({type:'init',data:_BgOption});
        }else if(msg === 'checked'){
            window.open('','1111111',"toolbar=yes, menubar=no, scrollbars=yes, resizable=yes,location=yes, status=yes,alwaysRaised=yes,depended=no")
        }

  });
});
