//todo:间距测量

function openTab(url,tab){
  var tabObj=tab;
  if(tabObj){
    console.log(tab)
    tabObj = chrome.tabs.update(tab.id,{url:url});
    window.close();
  }else{
    tabObj = chrome.tabs.create({url:url});
  }
  return tabObj;
}
function openWindow(url,title){
    openTab('javascript:window.open("'+url+'","","toolbar=yes, menubar=no, scrollbars=yes, resizable=yes,location=yes, status=yes,alwaysRaised=yes,depended=no");window.close()');
}
//var options=localStorage.options?JSON.parse(localStorage.options):{};

//chrome post
var chromePost = function(ext){
    var port = ext.connect();
    var portArr = {};
    port.onMessage.addListener(function(msg) {//获取配置后开始执行程序
        if(portArr[msg.type])portArr[msg.type].call(chromePost,msg.data);
    });
    return {
        bind:function(type,callback){
            portArr[type]=callback||function(_data){console.log(_data)};
            return chromePost;
        },
        unbind:function(type){
            portArr[type] = function(){};
            return chromePost;
        },
        send:function(type,data){
            port.postMessage({type:type,data:data});
            return chromePost;
        }

    }
}(chrome.extension);

var re = React.createElement,
    rc = React.createClass,
    rd = ReactDOM.render;

var SelectionComponent = rc({
    displayName:'SelectionComponent',

    render:function(){

      var createOptions = function(){

          var data = this.props.selectData;
          var _arr=[];
          for(var i =0;i<data.length;i++){
            _arr.push(re('option',{value:data[i].siteName,key:i},data[i].siteName));
          }
          return _arr;
      };
      return re(
                  'div',
                  {className:'row'},
                  re(
                      'div',
                      {className:'col-xs-12 form-horizontal'},
                      re(
                          'div',
                          {className:'form-group form-group-xs'},
                          re(
                              'div',
                              {className:'col-sm-10'},
                              re(
                                  'select',
                                  {value:this.props.value,className:'form-control input-sm',onChange:this.props.SelectChangeHandle},
                                  createOptions.call(this)
                              )
                          )
                      )
                  )
              )
    }
});
var TableComponent = rc({
    displayName:'TableComponent',
    render:function(){
      var createTD = function(){
          var data = this.props.tableData;
          var _arr = [];

          for(var i=0;i<data.length;i++){
              //console.log(data[i]);
              var wcm = data[i].BL.replace(/\/$/,'')+'/siteadmin#/'+this.props.sitePath.replace(/^\/|\/$/,''),
                  BluePrint = wcm.replace(/\/siteadmin#\//,'/cf#/')+'/index.html',
                  LiveCopy = data[i].LP;
              _arr.push(
                  re(
                      'tr',
                      {key:i},
                      re('td',null,re('a',{href:'#',"data-href":wcm},data[i].name)),
                      re('td',null,re('a',{href:'#',"data-href":BluePrint},'BluePrint')),
                      re('td',null,re('a',{href:'#',"data-href":LiveCopy},'LiveCopy'))
                    )
              )
          }
          return _arr;
      };

      return re(
        'table',
        {className:'table table-striped'},
        re('tbody',{onClick:this.props.TDClickHandle},createTD.call(this))
      )

    }
});
var BtnComponent = rc({
    displayName:'BtnComponent',
    render:function(){
        return re('button',{className:'btn btn-default',type:'button',onClick:this.props.BtnClickHandle},'追加wcmmode=disabled')
    }
});
var OptionComponent = rc({
    displayName:'OptionComponent',
    render:function(){

        return re(
                    'div',
                    {className:'row options'},
                    re(
                        'div',
                        {className:'form-group'},
                        re(
                            'div',
                            {className:'col-sm-offset-2 col-sm-10'},
                            re(
                                'div',
                                {className:'checkbox'},
                                re(
                                    'a',
                                    {className:'extSet pull-right',onClick:this.props.clickSetOption},
                                    "设置"
                                )/*,
                                re(
                                    'label',
                                    {className:'pull-left',onChange:this.props.checkChangeHandle},
                                    re('input',{type:'checkbox',checked:this.props.optionsChecked}),
                                    ' editor.html→cf'
                                )*/
                            )
                        )
                    )
               )
    }
});
var WrapComponent = rc({
    displayName:'WrapComponent',
    getInitialState:function(){
        return {tableData:[],selectValue:'',sitePath:'',optionsChecked:false}
    },
    componentWillMount:function(){
        this.setState({
                        tableData:this.props.data.siteData[0]?this.props.data.siteData[0].siteHost:'',
                        selectValue:this.props.data.siteData[0]?this.props.data.siteData[0].siteName:'',
                        sitePath:this.props.data.siteData[0]?this.props.data.siteData[0].sitePath:'',
                        optionsChecked:this.props.data.optionsChecked
        })
    },
    SelectChangeHandle:function(e){
        var value = e.target.value;
        var i=0;
        for(;i<this.props.data.siteData.length;i++){
            if(this.props.data.siteData[i].siteName===value){
                break;
            }
        }

        this.setState({tableData:this.props.data.siteData[i].siteHost,selectValue:this.props.data.siteData[i].siteName,sitePath:this.props.data.siteData[i].sitePath})
    },
    TDClickHandle:function(e){
        if(e.target.dataset.href.indexOf('siteadmin')>-1){
            openWindow(e.target.dataset.href, e.target.innerHTML);
            chrome.tabs.update(this.props.data.tab.id,{active:true});

        }else{
            openTab(e.target.dataset.href)
        }
    },
    BtnClickHandle:function(){
        console.log(this.props.data.tab.url.replace(/\?[^?]*$/,'')+'?wcmmode=disabled')
        //this.props.data.tab.url=this.props.data.tab.url.replace(/\?[^?]*$/,'')+'?wcmmode=disabled';
        openTab(this.props.data.tab.url.replace(/\?#[^?#]*$/,'')+'?wcmmode=disabled',this.props.data.tab)
    },
    clickSetOption:function(){
        var optionPage = this.props.data.optionPage;
        chromePost.bind('popup_need_open_option_page',function(){
            //window.close();
        }).send('popup_need_open_option_page');
        //if(optionPage.status){//已存在此页面
        //
        //
        //    chrome.windows.update(optionPage.tab.windowId, {focused:true}, function (data){
        //        console.log(data)
        //        chrome.tabs.update(optionPage.tab.id,{active:true});
        //        window.close();
        //    })
        //
        //
        //}else{
        //    openTab('/option.html');
        //
        //}

    },
    checkChangeHandle:function(e){
        console.log(e.target.checked)
    },
    render:function(){
        return re(
                    'div',
                    {className:'container'},
                    this.props.display?
                    [re(SelectionComponent,{key:0,selectData:this.props.data.siteData,SelectChangeHandle:this.SelectChangeHandle,value:this.state.selectValue}),
                    re(TableComponent,{key:1,sitePath:this.state.sitePath,tableData:this.state.tableData,TDClickHandle:this.TDClickHandle}),
                    re('div',{className:'row wcmmode text-center',key:2},re(BtnComponent,{BtnClickHandle:this.BtnClickHandle})),
                    re(OptionComponent,{key:3,clickSetOption:this.clickSetOption,optionsChecked:this.state.optionsChecked,checkChangeHandle:this.checkChangeHandle})]:
                    re('div',{className:'need-add'},'没有数据，立即',re('a',{href:'#',onClick:this.clickSetOption},'设置'))
                )
    }
});

chromePost.bind('init',function(data){
    console.log(data)
    var siteData =data.siteData;//获取option
    rd(re(WrapComponent,{display:'siteData' in data && data.siteData.length,data:data}),document.getElementById('container'))
}).send('init');




