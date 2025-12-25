// 通过CDN加载jQuery
(function() {
    // 加载jQuery
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
    script.onload = function() {
        console.log('jQuery loaded successfully');
        main();
    };
    script.onerror = function() {
        console.error('Failed to load jQuery');
    };
    document.head.appendChild(script);
})();

function main() {
    // 1. 清空页面内容
    $('body').empty();
    
    // 创建页面结构
    $('body').html(`
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2>支付宝账户信息</h2>
            <div id="userInfo" style="margin: 20px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                <p>加载中...</p>
            </div>
            
            <h2>账户余额</h2>
            <div id="balance" style="margin: 20px 0; padding: 10px; background: #e8f5e9; border-radius: 5px;">
                <p>加载中...</p>
            </div>
            
            <h2>完整JSON数据</h2>
            <textarea id="jsonData" style="width: 100%; height: 400px; font-family: monospace; padding: 10px;" readonly></textarea>
        </div>
    `);
    
    // 2. 获取登录账户信息
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
            console.log('User Info:', data);
            
            var logonUserId = data.logonUserId;
            var logonName = data.logonName;
            
            // 显示用户信息
            $('#userInfo').html(`
                <p><strong>用户ID:</strong> ${logonUserId}</p>
                <p><strong>用户名:</strong> ${logonName}</p>
            `);
            
            // 3. 获取账户详情
            getAccountDetail(logonUserId);
        },
        error: function(xhr, status, error) {
            console.error('获取用户信息失败:', error);
            $('#userInfo').html(`
                <p style="color: red;">获取用户信息失败: ${error}</p>
                <p>可能原因: CORS限制或未登录</p>
            `);
        }
    });
}

function getAccountDetail(logonUserId) {
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
            ctoken: 'ccc',
            _output_charset: 'utf-8',
            _input_charset: 'gbk'
        },
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            console.log('Account Detail:', response);
            
            try {
                // 获取余额
                var balance = response.result.detail[0].balance;
                
                // 显示余额
                $('#balance').html(`
                    <p><strong>账户余额:</strong> <span style="font-size: 24px; color: #4caf50;">${balance}</span></p>
                `);
                
                // 显示完整JSON
                $('#jsonData').val(JSON.stringify(response, null, 2));
                
            } catch(e) {
                console.error('解析数据失败:', e);
                $('#balance').html(`
                    <p style="color: red;">解析余额失败: ${e.message}</p>
                `);
                $('#jsonData').val(JSON.stringify(response, null, 2));
            }
        },
        error: function(xhr, status, error) {
            console.error('获取账户详情失败:', error);
            $('#balance').html(`
                <p style="color: red;">获取账户详情失败: ${error}</p>
                <p>可能原因: CORS限制、ctoken无效或未登录</p>
            `);
        }
    });
}
