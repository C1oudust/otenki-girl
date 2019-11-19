class Ms {
    //构造函数会在实例化的时候自动执行
    constructor() {
        const containerId = 'ms-container';
        // 检测下html中是否已经有message-container
        this.containerEl = document.getElementById(containerId);

        if (!this.containerEl) {
            this.containerEl = document.createElement('div');
            this.containerEl.id = containerId;
            document.body.appendChild(this.containerEl);
        }
    }
    //添加消息元素
    show({ img = './static/img/otenki-girl/success.png', text = '', duration = 3000 }) {
        let messageEl = document.createElement('div');
        messageEl.className = 'ms move-in';
        messageEl.innerHTML = `
            <img src="${img}">
            <div class="text">${text}</div>
            <div class="close icon icon-close"></div>
        `;
        this.containerEl.appendChild(messageEl);

        //用setTimeout做定时器
        setTimeout(() => {
            messageEl.className = messageEl.className.replace('move-in', '');
            messageEl.className += 'move-out';

            // 监听动画结束事件，在动画结束后把消息从dom树中移除。
            messageEl.addEventListener('animationend', () => {
                messageEl.remove();
            });
        }, duration);
    }
}

var data;
var img = new Image();
var m = new Ms();
img.src = "../../img/otenki-girl/img-main.png";

var pageSize = 10; //一页的消息数量
var pageIndex = 1; //页号
var totalPage; //总页数
var messageCount = 0; //消息总数

window.onload = (function () {
    getMessage(pageIndex);
});

function addMessage() {
    var date = document.getElementById("input_date").value;
    var address = document.getElementById("input_address").value;
    var name = document.getElementById("input_name").value;
    var reason = document.getElementById("input_reason").value;
    if (date === "" || address === "" || name === "" || reason === "") {
        alert("输入框不能为空!");
        return;
    }
    if (date.length > 20 || address.length > 20 || name.length > 20 || reason.length > 30) {
        alert("输入字符过多!");
        return;
    }
    $.ajax({
        type: 'post',
        url: '/Home/AddMessage',
        data: {
            date: date,
            address: address,
            name: name,
            reason: reason
        },
        success: function () {
            m.show({
                type: 'success',
                text: '祈愿成功~'
            });
            $("#input_date").val('');
            $("#input_address").val('');
            $("#input_name").val('');
            $("#input_reason").val('');
            var message =
                '<div class="reply">' +
                '<div class="reply_name">' + name + '</div >' +
                '<div id="reply_reason" class="reply_reason">' + reason + '</div>' +
                '<div id="reply_date" class="reply_date"> 在 ' + date + ' ，希望 ' + address + ' 天晴，发送于 ' + getDate()+
                '</div >' +
                '</div >';
            
            $("#replys").prepend(message);
            
        }
    });
}

function getMessage(pageIndex) {
    $.ajax({
        type: 'get',
        async: true,
        url: '/Home/GetMessage',
        data: { pageIndex: pageIndex},
        success: function (res) {
            messageCount = res.count;
            //根据消息总数和页大小计算页数
            totalPage = parseInt(messageCount > pageSize ? Math.ceil(messageCount / pageSize):1 );
            var  currentPageIndex = (totalPage) - (pageIndex - 1);

            data = res.m;
            //计算当前页的消息数量
            var currentPageMessage=0;
            if (pageIndex === 1 && messageCount < pageSize)
                currentPageMessage = messageCount;
            else if (pageIndex === totalPage)
                currentPageMessage = messageCount % pageSize;
            else
                currentPageMessage = pageSize;
            //计算当前页面消息在列表的位置
            var startIndex = currentPageIndex > 1 ? messageCount - (pageSize * (currentPageIndex - 1)) : 0;
            var endIndex = (startIndex===0)?currentPageMessage:startIndex + currentPageMessage - 1;
            //循环添加消息数据
            $("#replys").empty();
            for (var i = startIndex; i < endIndex; i++) {
                var resData = res.m[i];
                var message =
                    '<div class="reply">' +
                    '<div class="reply_name">' + resData.name +'</div >' +
                    '<div id="reply_reason" class="reply_reason">' + resData.reason +'</div>' +
                    '<div id="reply_date" class="reply_date"> 在 ' + resData.date + ' ，希望 ' + resData.address +' 天晴，发送于 '+resData.addTime+
                    '</div >' +
                    '</div >'
                document.getElementById("reply_page").prepend(message);
                $("#replys").prepend(message);
            }

            document.getElementById("reply_page").innerHTML = "第" + (pageIndex) + "页 / 共" + totalPage + "页";
        }
    });
}

function prePage() {
    if (pageIndex > 1) {
        pageIndex -= 1;
        getMessage(pageIndex);
    } else {
        alert("已经是第一页了！");
    }
}

function nextPage() {
    if (pageIndex < totalPage) {
        pageIndex += 1;
        getMessage(pageIndex);
    } else {
        alert("已经是最后一页了！");
    }
}

function getDate() {
    var d = new Date(),
        str = '';
    str += d.getFullYear() + '-'; //获取当前年份 
    str += d.getMonth() + 1 + '-'; //获取当前月份（0——11） 
    str += d.getDate() + ' ';
    str += d.getHours() + ':';
    str += d.getMinutes();
    //str += d.getSeconds();
    return str;
}


