(function() {
    // 1. 检查域名
    if (!window.location.hostname.includes('alipay.com')) {
        alert('⚠️ 此脚本必须在支付宝页面执行！\n\n请先打开以下任一页面:\n• https://render.alipay.com\n• https://enterpriseportal.alipay.com');
        return;
    }
    
    // 2. 加载 jQuery
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
    script.onload = function() {
        console.log('✅ jQuery 加载成功');
        main();
    };
    script.onerror = function() {
        console.error('❌ jQuery 加载失败');
    };
    document.head.appendChild(script);
})();

function main() {
    // 清空页面
    $('body').empty();
    
    // 创建UI
    $('body').html(`
        <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto;">
            <h1 style="color: #1677ff;">支付宝账户信息查询</h1>
            <p style="color: #666;">当前域名: ${window.location.hostname}</p>
            
            <h2>用户信息</h2>
            <div id="userInfo" style="margin: 20px 0; padding: 15px; background: #f0f0f0; border-radius: 8px; border-left: 4px solid #1677ff;">
                <p>⏳ 加载中...</p>
            </div>
            
            <h2>账户余额</h2>
            <div id="balance" style="margin: 20px 0; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #52c41a;">
                <p>⏳ 加载中...</p>
            </div>
            
            <h2>完整JSON数据</h2>
            <textarea id="jsonData" style="width: 100%; height: 400px; font-family: 'Courier New', monospace; padding: 10px; border: 1px solid #d9d9d9; border-radius: 4px;" readonly placeholder="等待数据加载..."></textarea>
        </div>
    `);
    
    console.log('📡 开始请求用户信息...');
    
    // 3. 获取用户信息（浏览器会自动带上 Referer）
    fetch('https://enterpriseportal.alipay.com/pamir/login/queryLoginAccount.json?_output_charset=utf-8&appScene=MRCH', {
        method: 'GET',
        credentials: 'include', // 包含 Cookie
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'X-Requested-With': 'XMLHttpRequest'
        }
        // 注意: 不设置 Referer，让浏览器自动处理
    })
    .then(response => {
        console.log('📥 响应状态:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ 用户信息:', data);
        
        var logonUserId = data.logonUserId;
        var logonName = data.logonName;
        
        $('#userInfo').html(`
            <p><strong>👤 用户ID:</strong> <code>${logonUserId}</code></p>
            <p><strong>📝 用户名:</strong> ${logonName}</p>
        `);
        
        // 获取账户详情
        getAccountDetail(logonUserId);
    })
    .catch(error => {
        console.error('❌ 获取用户信息失败:', error);
        $('#userInfo').html(`
            <p style="color: red;"><strong>❌ 获取失败:</strong> ${error.message}</p>
            <p style="color: #666; font-size: 12px;">可能原因: 未登录、Cookie过期、或CORS限制</p>
        `);
    });
}

function getAccountDetail(logonUserId) {
    console.log('📡 开始请求账户详情...');
    
    // 从 Cookie 中提取 ctoken
    var ctoken = getCookie('ctoken') || 'dP7W_pD78Qr111ZEYVopqInW';
    console.log('🔑 使用 ctoken:', ctoken);
    
    var formData = new URLSearchParams({
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
    });
    
    fetch('https://mbillexprod.alipay.com/enterprise/fundAccountDetail.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
    })
    .then(response => {
        console.log('📥 响应状态:', response.status);
        return response.json();
    })
    .then(response => {
        console.log('✅ 账户详情:', response);
        
        try {
            var balance = response.result.detail[0].balance;
            
            $('#balance').html(`
                <p><strong>💰 账户余额:</strong> <span style="font-size: 28px; color: #52c41a; font-weight: bold;">${balance}</span></p>
            `);
            
            $('#jsonData').val(JSON.stringify(response, null, 2));
            
        } catch(e) {
            console.error('❌ 解析数据失败:', e);
            $('#balance').html(`
                <p style="color: red;"><strong>❌ 解析失败:</strong> ${e.message}</p>
            `);
            $('#jsonData').val(JSON.stringify(response, null, 2));
        }
    })
    .catch(error => {
        console.error('❌ 获取账户详情失败:', error);
        $('#balance').html(`
            <p style="color: red;"><strong>❌ 获取失败:</strong> ${error.message}</p>
            <p style="color: #666; font-size: 12px;">可能原因: ctoken无效、未登录、或CORS限制</p>
        `);
    });
}

// 辅助函数: 从 Cookie 中获取值
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}
