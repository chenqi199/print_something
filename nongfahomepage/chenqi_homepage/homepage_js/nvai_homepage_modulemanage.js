/**
 * Description: modulemanage
 * Created by <a href='chenqi@tansun.com.cn'>chenqi</a>
 * On 2017/3/11.17:00
 *  <br/>
 */


function modulemanager() {



    function commonninit(id){
        $('#'+id). bind("select_node.jstree", function (e, data) {
            $('#'+id).jstree("toggle_node", "#" + data.node.id);
            var getUrl =   $('#'+id).jstree("get_node", "#" + data.node.id).a_attr.href;
            try {
                var treeNodes = $("#" + data.node.id).siblings();
                for (var i = 0; i < treeNodes.length; i++) {
                    $('#'+id).jstree("close_node", treeNodes[i]);
                }
                var childs = $("#" + data.node.id).find("li");
                var childs = $("#" + data.node.id).find("li");
                for (var i = 0; i < childs.length; i++) {
                    var isHasChilds =   $('#'+id).jstree("is_leaf", childs[i]);
                    if (!isHasChilds) {
                        var iconPrev = $(childs[i]).find(".jstree-icon").eq(0).prev();
                        iconPrev.css({
                            "background": "url('../images/menu_line.gif') no-repeat",
                            "background-position-y": "4px"
                        });
                    }
                }
            } catch (e) {

            }

        });

    }


    function moduletreeinit() {
        $('#gongwentree').jstree({
            core: {
                'expand_selected_onload': true,
                'tie_selection': false,
                "themes": {
                    "responsive": false
                },
                check_callback: true,
                'data': function (node, callback) {

                    //var url = 'http://10.6.30.122:8088/tansonjsondemo/menu/getmenu.do';
                    //var    result = E.ajaxGetResult(url, true, 'json');
                    var    result =[{"id":"gwgl","parent":"0","text":"公文管理","url":"","target":""},
                        {"id":"fwgl","parent":"gwgl","text":"发文管理","url":"","target":""},
                        {"id":"qcfw","parent":"fwgl","text":"起草发文","url":"exampleUrl","target":"content"},
                        {"id":"fwdb","parent":"fwgl","text":"待办","url":"exampleUrl","target":"_blank"},
                        {"id":"swgl","parent":"gwgl","text":"收文管理","url":"","target":""},
                        {"id":"bmsw","parent":"swgl","text":"部门收文","url":"","target":"content"}];

                    var menus = [];
                    for (var i = 0; i<result.length;i++){
                        if(result[i].id != 'gwgl'){
                            menus.push({
                                "id":result[i].id,
                                "parent":result[i].parent==="gwgl"?"#":result[i].parent,
                                "text":result[i].text,
                                "a_attr":{
                                    href: result[i].url,
                                    target:result[i].target
                                }

                            })
                        }

                    }
                    console.log('-------------------------==___________________'+JSON.stringify(menus));

                    callback.call(this,menus );
                }

            },
            plugins: ["wholerow",  "themes"],

            themes: {
                theme: "default",
                url: false,
                dots: false,
                icons: false
            }

        });




        $('#xingzhengtree').jstree({
            core: {
                'expand_selected_onload': true,
                'tie_selection': false,
                "themes": {
                    "responsive": false
                },
                check_callback: true,
                'data': function (node, callback) {

                    //var url = 'http://10.6.30.122:8088/tansonjsondemo/menu/getmenu.do';
                    //var    result = E.ajaxGetResult(url, true, 'json');
                    var    result = [{"id":"xzbg","parent":"0","text":"行政办公","url":"","target":""},{"id":"hygl","parent":"xzbg","text":"会议管理","url":"","target":""},{"id":"hyqc","parent":"hygl","text":"起草","url":"","target":"_blank"}];

                    var menus =getmenus(result,'xzbg');

                    callback.call(this,menus );
                }

            },
            plugins: ["wholerow",  "themes"],

            themes: {
                theme: "default",
                url: false,
                dots: false,
                icons: false
            }

        });




        $('#hangwutree').jstree({
            core: {
                'expand_selected_onload': true,
                'tie_selection': false,
                "themes": {
                    "responsive": false
                },
                check_callback: true,
                'data': function (node, callback) {

                    //var url = 'http://10.6.30.122:8088/tansonjsondemo/menu/getmenu.do';
                    //var    result = E.ajaxGetResult(url, true, 'json');
                    var    result = [{"id":"hwxx","parent":"0","text":"行务信息","url":"","target":""},{"id":"xxbs","parent":"hwxx","text":"信息报送","url":"","target":""},{"id":"grtg","parent":"xxbs","text":"个人投稿","url":"","target":"_blank"}];

                    var menus =getmenus(result,'hwxx');

                    callback.call(this,menus );
                }

            },
            plugins: ["wholerow",  "themes"],

            themes: {
                theme: "default",
                url: false,
                dots: false,
                icons: false
            }

        });




        $('#gonggoongtree').jstree({
            core: {
                'expand_selected_onload': true,
                'tie_selection': false,
                "themes": {
                    "responsive": false
                },
                check_callback: true,
                'data': function (node, callback) {

                    var url = 'http://10.6.10.89/ADBCWEBOAZH/WEBOA_HOMEPAGE.NSF/agGetMenuINFOjson?openagent' +
                        ' &FileKey=sendfile ' +
                        '&CurUserGW=#D126940325|' +
                        ' &CurUserDept=信息科技部 ' +
                        '&CurUnitType=总行';
                    var    result = E.ajaxGetResult(url, true, 'json');

                    var menus =getmenus(result.ViewData,'sendfile');

                    callback.call(this,menus );
                }

            },
            plugins: ["wholerow",  "themes"],

            themes: {
                theme: "default",
                url: false,
                dots: false,
                icons: false
            }

        });






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



    }
    moduletreeinit();
    commonninit('gongwentree');
    commonninit('xingzhengtree');
    commonninit('hangwutree');
    commonninit('gonggoongtree');
}
modulemanager();