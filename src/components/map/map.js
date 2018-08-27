import React from 'react'

export const BMapComponent=React.createClass({
    getDefaultProps:function(){
        const ID=`itminus_bmap${parseInt(Math.random()*10000000)}`;
        return {
            ak:'sGqH19jp9WgfI2nXrde4u9Dq',
            callback:function(map){},
            id:ID,
        };
    },
    componentWillMount(){
        // 注意callback=init参数不能去掉，因为这是百度地图异步加载的接口，
        // 否则，会因为React异步创建了script，百度返回的script中又调用document.write()，从而触发错误
        let bmapSrc=`http://api.map.baidu.com/api?v=2.0&ak=${this.props.ak}&callback=init`;
        if(typeof BMap !='undefined'){
            return;
        }else{
            let script=document.querySelector(`script[src='${bmapSrc}']`);
            if(!script){
                script= document.createElement("script");
                script.src = bmapSrc;
                document.body.appendChild(script);
            }
        }
    },
    componentDidMount(){
        function timeoutPromise(timeout){
            return new Promise(function(resolve,reject){
                setTimeout(function() {
                    resolve();
                }, timeout);
            });
        }
        function waitUntil(props){
            return new Promise(function(resolve,reject){
                const map=new BMap.Map(props.id);
                resolve(map);
            }).catch(err=>{
                // console.log("there's no BMap yet. Waitting ...",err);
                return timeoutPromise(300).then(()=>{
                    return waitUntil(props);
                });
            });
        }
        waitUntil(this.props).then(map=>{
            console.log(`[+] bmap loaded`,map);
            this.props.callback(map);
        });
    },
    render:function(){ 
        return <div id={this.props.id}></div>;
    } 
});
export default BMapComponent;
