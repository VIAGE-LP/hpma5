(function(w,d,s,u,a){if(!w.bdash){w.bdash = function(){w.bdash.queue.push(arguments);};
if(!w.bdashActivity){w.bdashActivity = function(){w.bdashActivity.queue.push(arguments);};}w.bdash.queue=[];w.bdash.load=new Date;w.bdashActivity.queue=[];w.bdashActivity.load=new Date;
var n=d.createElement(s);n.type='text/javascript',n.async=true,n.src=u;var t=d.getElementsByTagName(s)[0];t.parentNode.insertBefore(n,t);
}})(window,document,'script','//analytics.fs-bdash.com/bdash.js');
bdash('create', {id:'BD-38G7BY-1', domains:['g-cosme.net','bi-up.net','girls-cosme.jp','platinum-body.jp','kireimo.co','trust06.precs.jp','bikenko-cosme.jp','secure11.precs.jp','surari.jp','secure02.precs.jp','kirei-up-labo.com','standard-ssl01.rpst.jp','puresupli.com','pb.luvlit.jp','secure07.precs.jp','palebeaute.com','secure04.precs.jp','bijinden.jp','light-ssl01.rpst.jp','health-maker.asia','jbs-cosme.com','secure05.precs.jp','selfstyle.jp','coffrea.jp']});

(function(){
  var lc = document.location.href;
  if(lc.indexOf("complete")){
    bdash('set', {sendReady: function(e,t) {
      var m, n, orderId, site;
      try{
        var elms = document.getElementsByTagName("input");        
        if(elms){
          for(var i = 0; i < elms.length && !(nameElms && siteElms); i++){
            var nameElms = nameElms || elms[i] && elms[i].name && elms[i].name.match("order_id");
            var siteElms = siteElms || elms[i] && elms[i].name && elms[i].name.match("site");
            if(nameElms){
              for(var j = 0; j < elms.length && !orderId; j++){
                orderId = ( m = elms[j] && elms[j].value && elms[j].value.match(/^(\d+)$/)) && m[1];
              };
            }
            if(siteElms){
              for(var j = 0; j < elms.length && !site; j++){
                site = ( n = site || elms[j] && elms[j].value && elms[j].value.match(/(.*complete.*)/)) && n[1];
              };
            }
          };
        }
        t.set("relationalKey",orderId);
        t.set("customTrackingProperty1",site);
      }catch(ex){
      }
      t.send({type:'pageview'});
      t.set("relationalKey",null);
      t.set("customTrackingProperty1",null);
      }
    });}
  return false;
})()&&

bdash('send', {type:'pageview'});
bdash('set', {relationalKey:null});

