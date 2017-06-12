/**
 * Created by Administrator on 2017/6/12 0012.
 */

function myvote(sourceobj)
{
    var url = 'ajax.php';
    var user='';
    var nowtime = "12996417340";
    var ecode=9999;

    var vid = $(sourceobj).attr("val");
    var pars = 'nt='+nowtime+'&user='+user+'&vid='+vid+'&randcode='+ecode+"&time="+new Date().getTime();
    //console.log(pars);return false;
    /*
     var myAjax = new Ajax.Request(url,{method: 'post', parameters: pars, onComplete: showResponse});
     function showResponse(originalRequest)
     {
     }
     */

}

function tickeit() {
    $.ajax({
        type: "POST",
        url:  'ajax.php',
        data: {
            'nt':'12996417340',
            'uer':'',
            'vid':'6AF2EECgMGCwUABQYDCwBTCgoBAwEEUAEFBgQCBAEGBQIK',
            'ecode':'9999',
            'time':new Date().getTime()
        },
        success: function(originalRequest){
            console.log(originalRequest.responseText);
            console.log(originalRequest);
            if(originalRequest>99)
            {
                //console.log('不在投票范围内');
                console.log('投票成功!');
            }
            else if(originalRequest>8)
            {
                console.log('请勿重复投票1！');
            }
            else if(originalRequest>7)
            {
                console.log('请勿重复投票2！');
            }
            else if(originalRequest>6)
            {
                console.log('你不是投票用户,只有登陆的投票用户才可以投票!参赛选手不可以投票！');
            }
            else if(originalRequest>5)
            {
                console.log('请输入正确的验证码!请刷新以后再试一次!');
                // document.getElementById('randcode').focus();
            }
            else if(originalRequest>4)
            {
                console.log('不在投票的时间范围内!');
            }
            else if(originalRequest>3)
            {
                console.log('请登陆以后再进行投票!');
                // window.location.href='index.php';
            }
            else if (originalRequest>2)
            {
                console.log('你可能登陆超时了!');
                window.location.href='index.php';
            }
            else if (originalRequest>1)
            {
                console.log("抱歉，当日次数已超请勿重复投票!");
            }
            else if (originalRequest>0)
            {
                console.log('投票成功！');
                //art.dialog.close();
                //var msg=flashplayer.voteme();
                // window.location.reload();
            }
            else{
                console.log('请勿重复投票!');
            }


            // document.getElementById('randcode').value='';
        }
    });

}

// tickeit();
    setTimeout(tickeit(),1000);
