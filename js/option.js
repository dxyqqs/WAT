
var AEMOptions=localStorage.AEMOptions?JSON.parse(localStorage.AEMOptions): {siteData:[] };
//通知background page option页面开启
var port = chrome.extension.connect();
port.onMessage.addListener(function(msg) {//获取配置后开始执行程序
    console.log('done')
});
port.postMessage({type:'option_open'});

window.addEventListener('beforeunload',function(){

    port.postMessage({type:'option_close'});
})


//save data
function saveOpt(){
  console.log(AEMOptions)
  localStorage.AEMOptions=JSON.stringify(AEMOptions);
}
//创建一个blob地址
function createBlobURL(txt){
    var _bArr = [txt],
        _blob = new Blob(_bArr,{"type":"text/plan"});
    return window.URL.createObjectURL(_blob);
}


var RC = React.createClass,
    RE = React.createElement,
    RD = ReactDOM.render;
//Modal组件
var ModalComponent = React.createClass({
    displayName:'ModalComponent',
    clickHandle:function(){
        $(this.refs.modal).modal('hide');
    },
    render:function(){
        return React.createElement(
                'div',
                {className:'modal fade',ref:'modal'},
                React.createElement(
                        'div',
                        {className:'modal-dialog'},
                        React.createElement(
                                'div',
                                {className:'modal-content'},
                                React.createElement(
                                        'div',
                                        {className:'modal-header'},
                                        React.createElement(
                                                'button',
                                                {className:'close','data-dismiss':"modal",'aria-label':"Close"},
                                                React.createElement('span',{"aria-hidden":'true',dangerouslySetInnerHTML:{__html:'&times;'}})
                                        ),
                                        React.createElement(
                                                'h4',
                                                {className:'modal-title'},
                                                this.props.title
                                        )
                                ),
                                React.createElement(
                                        'div',
                                        {className:'modal-body',ref:'modalBody'},
                                        this.props.children||React.createElement('p',null,'One fine body&hellip;')
                                ),
                                React.createElement(
                                        'div',
                                        {className:'modal-footer'},
                                        React.createElement(
                                                'button',
                                                {className:'btn btn-default','data-dismiss':"modal"},
                                                this.props.Close||'Close'
                                        ),
                                        React.createElement(
                                                'button',
                                                {className:'btn btn-primary','aria-label':"Close",onClick:this.props.clickHandle},
                                                this.props.Save||'Save'
                                        )
                                )
                        )
                )
        )
    }
});
//表单组件
//FormComponentData
var FormComponent = RC({
    displayName:'FormComponent',
    getInitialState:function(){
      return {
          siteName:'',
          sitePath:'',
          DEVBL:'',
          DEVLP:'',
          STGBL:'',
          STGLP:'',
          UATBL:'',
          UATLP:''
      };
    },
    componentWillReceiveProps:function(props){

      this.setState({
        siteName:props.siteName,
        sitePath:props.sitePath,
        DEVBL:props.FormComponentData[0]?props.FormComponentData[0].BL:'',
        DEVLP:props.FormComponentData[0]?props.FormComponentData[0].LP:'',
        STGBL:props.FormComponentData[1]?props.FormComponentData[1].BL:'',
        STGLP:props.FormComponentData[1]?props.FormComponentData[1].LP:'',
        UATBL:props.FormComponentData[2]?props.FormComponentData[2].BL:'',
        UATLP:props.FormComponentData[2]?props.FormComponentData[2].LP:''

      })
    },
    onChangeHandle:function(e){
      var $target = $(e.target),
          $form   = $target.parents('form'),
          $hiden  = $form.find('input[type=hidden]');
      var obj = {};
      if($hiden.length){
          obj[$hiden[0].value+$target[0].name]=$target[0].value;
      }else{
          obj[$target[0].name]=$target[0].value;
      }
        this.setState(obj)

    },
    render:function(){
        return RE(
                'div',
                {className:'container-fluid'},
                RE(
                    'form',
                    {className:'row',onChange:this.onChangeHandle},
                    RE(
                        'div',
                        {className:"form-group col-sm-6"},
                        RE('label',{className:'control-label'},'siteName:'),
                        RE('input',{className:'form-control',type:'text',name:'siteName',value:this.state.siteName})
                    ),
                    RE(
                        'div',
                        {className:"form-group col-sm-6"},
                        RE('label',{className:'control-label'},'sitePath:'),
                        RE('input',{className:'form-control',type:'text',name:'sitePath',value:this.state.sitePath})
                    )
                ),
                RE(
                    'form',
                    {className:'row',onChange:this.onChangeHandle},
                    RE('input',{className:'form-control',type:'hidden',name:'name',value:'DEV'}),
                    RE(
                        'div',
                        {className:"form-group col-sm-6"},
                        RE('label',{className:'control-label'},'DEV-BL:'),
                        RE('input',{className:'form-control',type:'text',name:'BL',value:this.state.DEVBL})
                    ),
                    RE(
                        'div',
                        {className:"form-group col-sm-6"},
                        RE('label',{className:'control-label'},'DEV-LP:'),
                        RE('input',{className:'form-control',type:'text',name:'LP',value:this.state.DEVLP})
                    )
                ),
                RE(
                    'form',
                    {className:'row',onChange:this.onChangeHandle},
                    RE('input',{className:'form-control',type:'hidden',name:'name',value:'STG'}),
                    RE(
                        'div',
                        {className:"form-group col-sm-6"},
                        RE('label',{className:'control-label'},'STG-BL:'),
                        RE('input',{className:'form-control',type:'text',name:'BL',value:this.state.STGBL})
                    ),
                    RE(
                        'div',
                        {className:"form-group col-sm-6"},
                        RE('label',{className:'control-label'},'STG-LP:'),
                        RE('input',{className:'form-control',type:'text',name:'LP',value:this.state.STGLP})
                    )
                ),
                RE(
                    'form',
                    {className:'row',onChange:this.onChangeHandle},
                    RE('input',{className:'form-control',type:'hidden',name:'name',value:'UAT'}),
                    RE(
                        'div',
                        {className:"form-group col-sm-6"},
                        RE('label',{className:'control-label'},'UAT-BL:'),
                        RE('input',{className:'form-control',type:'text',name:'BL',value:this.state.UATBL})
                    ),
                    RE(
                        'div',
                        {className:"form-group col-sm-6"},
                        RE('label',{className:'control-label'},'UAT-LP:'),
                        RE('input',{className:'form-control',type:'text',name:'LP',value:this.state.UATLP})
                    )
                )
        )

    }


});
var HeaderComponent= RC({
    displayName:'HeaderComponent',
    render:function(){
      return RE('h2',null,this.props.title)
    }
});
var BtnComponent = RC({
    displayName:'BtnComponent',
    render:function(){
      return RE('button',{type:'button',className:"pull-right btn btn-primary "+this.props.cls,onClick:this.props.onClick},this.props.value)
    }
});
var TableComponent = RC({
    displayName:'TableComponent',
    render:function(){
      var thead = function(data){
          var _arr = [];
          if(data&&data.length){
            for(var i=0;i<data.length;i++){
              _arr.push(RE('th',{key:i},data[i]))
            }
          }
          return _arr;
      };
      var tbody = function(data){
          var _arr = [];
          if(data&&data.length){

            for(var i=0;i<data.length;i++){
                _arr.push(RE(
                              'tr',
                              {key:i},
                              RE('td',{className:'col-even'},data[i].siteName),
                              RE('td',{className:'col-odd'},data[i].sitePath),
                              RE('td',{className:'col-even'},RE('span',{className:'break-all'},data[i].siteHost[0].BL)),
                              RE('td',{className:'col-odd'},RE('span',{className:'break-all'},data[i].siteHost[0].LP)),
                              RE('td',{className:'col-even'},RE('span',{className:'break-all'},data[i].siteHost[1].BL)),
                              RE('td',{className:'col-odd'},RE('span',{className:'break-all'},data[i].siteHost[1].LP)),
                              RE('td',{className:'col-even'},RE('span',{className:'break-all'},data[i].siteHost[2].BL)),
                              RE('td',{className:'col-odd'},RE('span',{className:'break-all'},data[i].siteHost[2].LP)),
                              RE('td',{className:'text-nowrap col-even'},RE('a',{href:'#',style:{display:'block',marginBottom:6},className:'edit','data-index':i,onClick:this.props.onClickEdit},'修改'),RE('a',{href:'#',style:{display:'block'},className:'delete','data-index':i,onClick:this.props.onClickDelete},'删除'))
                            )
                          )
            }
          }else{
            _arr.push(RE('tr',{key:Date.now()},RE('td',{colSpan:this.props.thead.length},RE('b',null,'暂无数据'))))
          }
          return _arr;
      }
      return RE(
        'table',
        {className:"table table-striped"},
        RE('thead',null,RE("tr",null,thead.call(this,this.props.thead))),
        RE('tbody',{id:'tableViewWrap'},tbody.call(this,this.props.tbody))
      )
    }
});
var WrapComponent = RC({
    displayName:'WrapComponent',
    getInitialState:function(){
      var _InitialState = {
          tbody:"siteData"in AEMOptions?AEMOptions.siteData:[],
          FormComponentData:[],
          title:'新增',
          siteName:'',
          sitePath:'',
          save:'保存',
          fileValue:'',
          download:''
      };
      //获取lg中的配置，生成文件提供下载
      if(_InitialState.tbody.length>0){
          _InitialState.download = createBlobURL(JSON.stringify(AEMOptions));
      }
      return _InitialState;
    },
    getDefaultProps:function(){
      return {}
    },
    modal:null,//当前操作modal
    dataIndex:-1,//当前操作的数据对象在数组中的下标
    onClickAdd:function(){//新增
      this.modal = this.refs.myModal;
      var modal = this.refs.myModal.refs.modal,
          modalBody = this.refs.myModal.refs.modalBody;
      this.setState({title:'新增',FormComponentData:[],siteName:'',sitePath:'',save:'保存'});
    },
    onClickEdit:function(e){//修改
      this.modal = this.refs.myModal;
      var dataIndex= $(e.target)[0].dataset.index;
      var data = AEMOptions.siteData[dataIndex];
      this.dataIndex = dataIndex;
      this.setState({title:'正在修改'+data.siteName,FormComponentData:data.siteHost,siteName:data.siteName,sitePath:data.sitePath,save:'修改'});
      return false;
    },
    onClickDelete:function(e){//删除
      this.modal = this.refs.deleteConfirm;
      var dataIndex= $(e.target)[0].dataset.index;
      var data = AEMOptions.siteData[dataIndex];
      this.setState({deleteTitle:data.siteName});
      this.dataIndex = dataIndex;
      return false;
    },
    onClickImport:function(e){
        this.refs.import.click();
    },
    onChangeImport:function(e){//读取文件
        this.setState({fileValue:this.refs.import.value});
        var ts =this;
        if(this.refs.import.files[0]){
            var fr = new FileReader();
            fr.onload=function(e){
                fr.onload=null;
                try{
                    console.log(e.target.result);
                    var _json = JSON.parse(e.target.result);
                    if(!('siteData' in _json)){
                        throw new Error('data format error!')
                    }else{
                        AEMOptions=_json;
                        //生成下载链接
                        ts.setState({tbody:AEMOptions.siteData,download: createBlobURL(e.target.result)});
                        saveOpt();
                    }
                }catch(e){
                    return false;
                }

            };
            //console.log(this.refs.import.files[0])
            fr.readAsText(this.refs.import.files[0]);
        }

    },
    data_delete:function(e){
      var modal = $(e.target).parents('.modal')[0];
      $(modal).modal('hide');
      AEMOptions.siteData.splice(this.dataIndex,1);
      var o={tbody:AEMOptions.siteData};
      o.download=AEMOptions.siteData.length>0?createBlobURL(JSON.stringify(AEMOptions)):'';
      this.setState(o);
      //this.modal=null;
      this.dataIndex=-1;
      saveOpt();
    },
    data_add_edit:function(e){
      var modal = $(e.target).parents('.modal')[0];
      var _o = {siteName:'',sitePath:'',siteHost:[]}
      $(modal).find('form').each(function(i,e){
          if(i==0){
            _o.siteName = e.siteName.value;
            _o.sitePath = e.sitePath.value;
          }else{
            _o.siteHost.push({name:e.name.value,BL:e.BL.value,LP:e.LP.value})
          }
      })
      if(!_o.siteName){
        alert('请填加完整的数据！');
        return;
      }
      if(this.dataIndex<0){//add
        AEMOptions.siteData.push(_o);
      }else{//edit
        AEMOptions.siteData.splice(this.dataIndex,1,_o);
        this.dataIndex=-1;
      }
      $(modal).modal('hide');
      this.setState({tbody:AEMOptions.siteData,download:createBlobURL(JSON.stringify(AEMOptions))});
      saveOpt();
    },
    onChangeHandle:function(e){//输入框检测
        var dom = e.target;
        console.log(dom.value)
    },
    componentDidMount:function(){

    },
    componentDidUpdate:function(){
      //console.log(this.modal)
      if(this.modal){
        $(this.modal.refs.modal).modal('show');
        this.modal=null;
      }
    },
    render:function(){
        return RE(
                  'div',
                  {className:'row'},
                  RE(
                      'div',
                      {className:'header-wrap'},
                      RE(BtnComponent,{cls:'add',value:this.props.add ,onClick:this.onClickAdd}),
                      this.props.import?RE(BtnComponent,{cls:'add',value:this.props.import ,onClick:this.onClickImport}):null,
                      this.props.import?RE('input',{ref:'import',type:'file',onChange:this.onChangeImport,value:this.state.fileValue}):null,
                      RE(HeaderComponent,{title:this.props.title})
                  ),
                  RE(
                      'div',
                      null,
                      RE(TableComponent,{tbody:this.state.tbody,thead:this.props.thead,onClickEdit:this.onClickEdit,onClickDelete:this.onClickDelete})
                  ),
                  this.state.download?RE('a',{href:this.state.download,download:"WAT_OPtion.txt"},'保存配置'):null,
                  RE(ModalComponent,{title:'删除确认',ref:'deleteConfirm',Close:'取消',Save:'确定',clickHandle:this.data_delete},RE('span',null,RE('p',null,'确定删除'+this.state.deleteTitle+'？'))),
                  RE(ModalComponent,{title:this.state.title,ref:'myModal',Close:'取消',Save:this.state.save,clickHandle:this.data_add_edit},RE(FormComponent,{siteName:this.state.siteName,sitePath:this.state.sitePath,FormComponentData:this.state.FormComponentData}))
              )
    }
});

RD(
    RE(
      WrapComponent,
      {
        title:"添加站点",
        add:'新增',
        import:'导入',
        thead:["siteName","sitePath","DEV","DEVLP","STG","STGLP","UAT","UATLP","操作"],
        tbody:AEMOptions.siteData
      }
    ),
    $('.container')[0]
  )
