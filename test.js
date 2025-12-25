(function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
    script.onload = function() {
        console.log('jQuery loaded successfully');
        main();
    };
    document.head.appendChild(script);
})();

function main() {
    $('body').empty();
    
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
    
    // 使用 fetch，明确设置 referrerPolicy
    fetch('https://enterpriseportal.alipay.com/pamir/login/queryLoginAccount.json?_output_charset=utf-8&appScene=MRCH', {
        method: 'GET',
        credentials: 'include',
        referrerPolicy: 'unsafe-url', // 强制发送完整 referer
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://render.alipay.com/' // 手动设置 referer
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('User Info:', data);
        
        var logonUserId = data.logonUserId;
        var logonName = data.logonName;
        
        $('#userInfo').html(`
            <p><strong>用户ID:</strong> ${logonUserId}</p>
            <p><strong>用户名:</strong> ${logonName}</p>
        `);
        
        getAccountDetail(logonUserId);
    })
    .catch(error => {
        console.error('获取用户信息失败:', error);
        $('#userInfo').html(`
            <p style="color: red;">获取用户信息失败: ${error}</p>
        `);
    });
}

function getAccountDetail(logonUserId) {
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
        ctoken: 'dP7W_pD78Qr111ZEYVopqInW', // 使用你实际的 ctoken
        _output_charset: 'utf-8',
        _input_charset: 'gbk'
    });
    
    fetch('https://mbillexprod.alipay.com/enterprise/fundAccountDetail.json', {
        method: 'POST',
        credentials: 'include',
        referrerPolicy: 'unsafe-url', // 强制发送完整 referer
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://render.alipay.com/',
            'Origin': 'https://render.alipay.com'
        },
        body: formData
    })
    .then(response => response.json())
    .then(response => {
        console.log('Account Detail:', response);
        
        try {
            var balance = response.result.detail[0].balance;
            
            $('#balance').html(`
                <p><strong>账户余额:</strong> <span style="font-size: 24px; color: #4caf50;">${balance}</span></p>
            `);
            
            $('#jsonData').val(JSON.stringify(response, null, 2));
            
        } catch(e) {
            console.error('解析数据失败:', e);
            $('#balance').html(`
                <p style="color: red;">解析余额失败: ${e.message}</p>
            `);
            $('#jsonData').val(JSON.stringify(response, null, 2));
        }
    })
    .catch(error => {
        console.error('获取账户详情失败:', error);
        $('#balance').html(`
            <p style="color: red;">获取账户详情失败: ${error}</p>
        `);
    });
}
