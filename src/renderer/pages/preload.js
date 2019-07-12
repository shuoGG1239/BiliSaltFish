const ipc = require('electron').ipcRenderer;

window.addEventListener('DOMContentLoaded', function () {
    // 初始化样式
    let scrollbar = document.createElement('style');
    scrollbar.type = 'text/css';
    let css = `html{font-family:'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Segoe UI', 'Microsoft Yahei', Tahoma, Arial, STHeiti, sans-serif} 
            ::-webkit-scrollbar {
                width: 10px;
                height: 45px;
            }
            ::-webkit-scrollbar-thumb {
                background-color: rgb(255, 164, 187);
                border-radius: 5px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: rgb(251, 114, 153);
            }
            ::-webkit-scrollbar-track {
                background-color: transparent;
            }
            `;
    scrollbar.innerHTML = css;
    document.head.appendChild(scrollbar);

    // 普通视频页：自动最大化播放器
    if( window.location.href.indexOf('video/av') > -1 ||
        window.location.href.indexOf('html5player.html') > -1 ||
        window.location.href.indexOf('bangumi/play/') > -1 ) {
        let playerInitCheck = setInterval(() => {
            let wideScreenButton;
            if( wideScreenButton = document.querySelector('[class*="bilibili-player-iconfont-web-fullscreen"]') ) {
                wideScreenButton.click();
                // 隐藏全屏播放器（在某些情况下会出现）的滚动条
                document.body.style.overflow = 'hidden';
                // 从app层面把 上、下 按键传进来，方便播放器控制音量
                ipc.on('change-volume', (ev, arg) => {
                    let event = new KeyboardEvent('keydown', {
                        bubbles: true
                    });
                    // 傻逼玩意儿which和keycode因为deprecated变成只读了，替代的属性又还没通用，搞条毛？
                    Object.defineProperties(event, {
                        keyCode: { writeable: true, value: arg == 'up' ? 38 : 40 }
                    });
                    let volume = document.querySelector('.bilibili-player-iconfont-volume-max');
                    volume.dispatchEvent(event);
                });
                clearInterval(playerInitCheck);
            } else if( ++checkCount > 100 ) {
                clearInterval(playerInitCheck);
            }
        }, 50), checkCount = 0;
    }

    // 使用桌面版 HTML5 直播播放器
    if ( /\/\/live\.bilibili\.com\/\d+/.test(window.location.href) ) {
        let playerInitCheck = setInterval(() => {
            // 通过查询 HTML5 播放器 DIV 来判断页面加载
            if ( document.querySelector('.bp-no-flash-tips') ) {
                // 切换 HTML5 播放器
                window.EmbedPlayer.loader();
            } else if ( document.querySelector('.bilibili-live-player') ) {
                // 全屏播放器并隐藏聊天栏
                document.getElementsByTagName('body')[0].classList.add('player-full-win', 'hide-aside-area');
                // 隐藏聊天栏显示按钮
                let aside = document.getElementsByClassName('aside-area-toggle-btn')[0];
                aside.style.display = 'none';
                // 隐藏 haruna
                let haruna = document.getElementsByClassName('haruna-ctnr')[0];
                haruna.style.display = 'none';
                // 隐藏全屏播放器（在某些情况下会出现）的滚动条
                document.body.style.overflow = 'hidden';
                clearInterval(playerInitCheck);
            } else if ( ++checkCount > 1000 ) {
                clearInterval(playerInitCheck);
            }
        }, 100), checkCount = 0;
    }


    // 移除app广告
    let appAdCheck, appAdNode;
    function removeAppAd() {
        // 第一次check，如果上一次获取到的dom引用还在，我们就假设上一次设定的left: -99999px还有效，不做任何操作
        if (appAdNode) {
            return;
        }
        // 如果上一次的引用已经丢失了，就再次去获取元素
        // 如果获取不到该元素，就假设当前页面没有广告
        appAdNode = document.querySelector('[class*="-bottomOpenApp-"]');
        if (!appAdNode) {
            return;
        }
        // 如果获取成功，就重新设置一次left样式
        if (window.getComputedStyle(appAdNode)['left'] != '-999999px') {
            appAdNode.style.left = '-999999px';
        }
    }

    appAdCheck = setInterval(removeAppAd, 500);
    removeAppAd();
});