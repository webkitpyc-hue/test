(function() {
    console.log('🚀 开始创建 iframe...');
    
    // 1. 创建 iframe
    var iframe = document.createElement('iframe');
    iframe.id = 'alipayFrame';
    iframe.style.width = '100%';
    iframe.style.height = '800px';
    iframe.style.border = '2px solid #1677ff';
    iframe.style.borderRadius = '8px';
    
    // 先设置 src 为同域的页面
    iframe.src = 'https://b.alipay.com/robots.txt';
    
    document.body.appendChild(iframe);
    
    // 2. 等待 iframe 加载完成
    iframe.onload = function() {
        console.log('✅ iframe 加载完成');
        console.log('iframe location:', iframe.contentWindow.location.href);
        console.log('iframe domain:', iframe.contentDocument.domain);
        
        // 3. 设置 document.domain（父页面和 iframe 都要设置）
        try {
            // 父页面设置 domain
            document.domain = 'alipay.com';
            // iframe 设置 domain
            iframe.contentDocument.domain = 'alipay.com';
            
            console.log('✅ document.domain 设置成功');
        } catch(e) {
            console.error('❌ 设置 document.domain 失败:', e);
        }
        
        // 4. 在 iframe 中注入代码
        injectCodeToIframe(iframe);
    };
    
    iframe.onerror = function() {
        console.error('❌ iframe 加载失败');
    };
})();

function injectCodeToIframe(iframe) {
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    var iframeWin = iframe.contentWindow;
    
    console.log('📝 开始注入代码到 iframe...');
    
    // 清空 iframe 内容
    iframeDoc.open();
    iframeDoc.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>支付宝数据查询</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            padding: 20px;
            margin: 0;
            background: #f5f5f5;
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
        }
        h2 {
            color: #333;
            margin-top: 30px;
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
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 支付宝账户信息查询</h1>
        
        <div class="meta-info">
            <strong>执行环境:</strong><br>
            • Window Location: <code id="winLocation">检测中...</code><br>
            • Document Domain: <code id="docDomain">检测中...</code><br>
            • Origin: <code id="origin">检测中...</code>
        </div>
        
        <h2>👤 用户信息</h2>
        <div id="userInfo" class="info-box user loading">
            <p>⏳ 正在加载用户信息...</p>
        </div>
        
        <h2>💰 账户余额</h2>
        <div id="balance" class="info-box balance loading">
            <p>⏳ 等待用户信息加载完成...</p>
        </div>
        
        <h2>📄 完整JSON数据</h2>
        <textarea id="jsonData" placeholder="等待数据加载..." readonly></textarea>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
    <script>
        // 等待 jQuery 加载
        window.addEventListener('load', function() {
            if (typeof jQuery === 'undefined') {
                console.error('❌ jQuery 加载失败');
                $('#userInfo').html('<p class="error">jQuery 加载失败，请刷新重试</p>');
                return;
            }
            
            console.log('✅ jQuery 加载成功');
            console.log('📍 当前执行环境:');
            console.log('  - window.location:', window.location.href);
            console.log('  - document.domain:', document.domain);
            console.log('  - window.origin:', window.origin);
            
            // 显示环境信息
            $('#winLocation').text(window.location.href);
            $('#docDomain').text(document.domain);
            $('#origin').text(window.origin || 'N/A');
            
            // 设置 document.domain
            try {
                document.domain = 'alipay.com';
                console.log('✅ document.domain 已设置为: alipay.com');
            } catch(e) {
                console.error('❌ 设置 document.domain 失败:', e);
            }
            
            // 开始获取数据
            main();
        });
        
        function main() {
            console.log('📡 开始请求用户信息...');
            
            // 获取用户信息
            $.ajax({
                url: 'https://enterpriseportal.alipay.com/pamir/login/queryLoginAccount.json',
                type: 'GET',
                data: {
                    _output_charset: 'utf-8',
                    appScene: 'MRCH'
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    console.log('✅ 用户信息获取成功:', data);
                    
                    var logonUserId = data.logonUserId;
                    var logonName = data.logonName;
                    
                    $('#userInfo').removeClass('loading').html(
                        '<p><strong>用户ID:</strong> <code>' + logonUserId + '</code></p>' +
                        '<p><strong>用户名:</strong> ' + logonName + '</p>'
                    );
                    
                    // 获取账户详情
                    getAccountDetail(logonUserId);
                },
                error: function(xhr, status, error) {
                    console.error('❌ 获取用户信息失败:', error);
                    console.error('状态码:', xhr.status);
                    console.error('响应:', xhr.responseText);
                    
                    $('#userInfo').removeClass('loading').addClass('error').html(
                        '<p><strong>❌ 获取失败:</strong> ' + error + '</p>' +
                        '<p><strong>状态码:</strong> ' + xhr.status + '</p>' +
                        '<p style="font-size: 12px;">可能原因: 未登录、Cookie过期、或CORS限制</p>'
                    );
                }
            });
        }
        
        function getAccountDetail(logonUserId) {
            console.log('📡 开始请求账户详情...');
            
            // 从 Cookie 中获取 ctoken
            var ctoken = getCookie('ctoken') || 'dP7W_pD78Qr111ZEYVopqInW';
            console.log('🔑 使用 ctoken:', ctoken);
            
            $('#balance').html('<p>⏳ 正在加载账户余额...</p>');
            
            $.ajax({
                url: 'https://mbillexprod.alipay.com/enterprise/fundAccountDetail.json',
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
                success: function(response) {
                    console.log('✅ 账户详情获取成功:', response);
                    
                    try {
                        var balance = response.result.detail[0].balance;
                        
                        $('#balance').removeClass('loading').html(
                            '<div class="balance-amount">¥ ' + balance + '</div>' +
                            '<p style="color: #666; font-size: 14px;">查询时间: ' + new Date().toLocaleString() + '</p>'
                        );
                        
                        $('#jsonData').val(JSON.stringify(response, null, 2));
                        
                    } catch(e) {
                        console.error('❌ 解析数据失败:', e);
                        $('#balance').removeClass('loading').addClass('error').html(
                            '<p><strong>❌ 解析失败:</strong> ' + e.message + '</p>'
                        );
                        $('#jsonData').val(JSON.stringify(response, null, 2));
                    }
                },
                error: function(xhr, status, error) {
                    console.error('❌ 获取账户详情失败:', error);
                    console.error('状态码:', xhr.status);
                    console.error('响应:', xhr.responseText);
                    
                    $('#balance').removeClass('loading').addClass('error').html(
                        '<p><strong>❌ 获取失败:</strong> ' + error + '</p>' +
                        '<p><strong>状态码:</strong> ' + xhr.status + '</p>' +
                        '<p style="font-size: 12px;">可能原因: ctoken无效、未登录、或CORS限制</p>'
                    );
                }
            });
        }
        
        function getCookie(name) {
            var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : null;
        }
    </script>
</body>
</html>
    `);
    iframeDoc.close();
    
    console.log('✅ 代码注入完成');
}
