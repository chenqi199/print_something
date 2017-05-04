/**
 * Description: todo
 * Created by <a href='chenqi@tansun.com.cn'>chenqi</a>
 * On 2017/3/13.14:44
 *  <br/>
 */
function modulemanager() {
    console.log("触发模块管理按钮");



    $('#modulemanagetree'). bind("select_node.jstree", function (e, data) { //左键单击事件
        //触发toggle_node 事件  就行了
        $('#modulemanagetree').jstree("toggle_node", "#" + data.node.id);//展开点击事件对象子节点
//                $('#modulemanagetree').jstree("toggle_node", ".jstree-wholerow jstree-wholerow-clicked");
        try {
            var treeNodes = $("#" + data.node.id).siblings();
            for (var i = 0; i < treeNodes.length; i++) {
                $('#modulemanagetree').jstree("close_node", treeNodes[i]);//关闭点击事件对象的兄弟节点
//                    console.log(treeNodes[i]);
            }
//                var childs=  $('#modulemanagetree').jstree("get_children_dom",  data.node);
            var childs = $("#" + data.node.id).find("li");
//                console.log(childs);
            for (var i = 0; i < childs.length; i++) {
                var isHasChilds = $('#modulemanagetree').jstree("is_leaf", childs[i]);
                if (!isHasChilds) {
                    var iconPrev =  $(childs[i]).find(".jstree-icon").eq(0).prev();
                    iconPrev.css("background","url('images/menu_line.gif') no-repeat");
                }
            }
        } catch (e) {
            console.log(e + '++++++++++++++++++++++++++++++++++')
        }
    });

    function init() {
        console.log("initTree");


        $('#modulemanagetree').jstree({
            core: {
                'expand_selected_onload': true, //选中项蓝色底显示
                'tie_selection': false,
                "themes": {
                    "responsive": false
                },
                check_callback: true,

                'data': function (node, callback) {


                    var url = 'agGetMenuINFOjson?openagent&FileKey=sendfile&CurUserGW=#D126940325|&CurUserDept=信息科技部CurUnitType=总行';
                    var    result = E.ajaxGetResult(url, false,'text');
                    var   jsondata = result.substring(result.indexOf("{"),result.lastIndexOf("}]}")+3);

                    try{
                        var mymenus= JSON.parse(jsondata);
                        var menus= getmenus(mymenus.ViewData,'sendfile')
                    }catch (e){
                        console.log(e)
                    }
                    //  var menus =getmenus(result.innerHTML,'sendfile');


                    callback.call(this,menus );
                }
            },
            plugins: ["wholerow", "themes"],//指定使用哪些插件

            themes: {        //themes插件设置
                theme: "default", //设置theme主题，默认是"default"，可选值：default、apple、classic、default-rtl
                url: false,        //设置theme css文件的路径
                dots: false,        //是否显示虚线点
                icons: false    //是否显示节点前的图标，$("a > ins.jstree-icon")
            }
//
        });
    }
    function getmenus(jsonMenus,parent){//获取二级节点为根节点
        var menus = [];
        console.log('befor___________________________________________'+JSON.stringify(jsonMenus));
        for (var i = 0; i<jsonMenus.length;i++){
            if (jsonMenus[i].id!=parent){
                menus.push( {
                    "id":jsonMenus[i].id,
                    "parent":jsonMenus[i].parent===parent?"#":jsonMenus[i].parent,
                    "text":jsonMenus[i].text,
                    "a_attr":{
                        href: jsonMenus[i].url,
                        target:jsonMenus[i].target
                    }
                })

            }

        }
        console.log('__________________________getmenus'+JSON.stringify(menus));
        return menus;
    }
    init();


}
modulemanager();