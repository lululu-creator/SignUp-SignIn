const wrapper = document.querySelector('.wrapper');
const SignUplink = document.querySelector('.signUp-link');
const SignInlink = document.querySelector('.signIn-link');
const buttons = document.querySelectorAll('.Btn');

// 切换登录注册表单的动画效果
SignUplink.addEventListener('click', (event) => {
    event.preventDefault();
    console.log("点击了注册链接");
    wrapper.classList.add('animate-signIn');
    wrapper.classList.remove('animate-signUp');
});

SignInlink.addEventListener('click', (event) => {
    event.preventDefault();
    console.log("点击了登录链接");
    wrapper.classList.add('animate-signUp');
    wrapper.classList.remove('animate-signIn');
});

// 为所有按钮添加事件监听
buttons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        console.log("点击了按钮");
        
        // 判断是哪个表单的按钮被点击
        const isSignUp = this.closest('.form-wrapper').classList.contains('signUp');
        
        console.log("当前按钮所在表单 - 注册模式:", isSignUp);
        
        if (isSignUp) {
            // 注册逻辑
            const username = document.getElementById('SUsername').value;
            const email = document.getElementById('SEmail').value;
            const password = document.getElementById('SPassword').value;
            
            console.log("注册信息:", { username, email, password: '***' });
            
            // 简单的输入验证
            if (!username || !email || !password) {
                alert('请填写所有字段');
                return;
            }
            
            // 发送注册请求
            console.log("发送注册请求");
            fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })
            .then(response => {
                console.log("注册响应状态:", response.status);
                return response.json();
            })
            .then(data => {
                console.log("注册响应数据:", data);
                if (data.error) {
                    alert('注册失败: ' + data.error);
                } else {
                    alert('注册成功，请登录');
                    // 切换到登录表单
                    wrapper.classList.add('animate-signUp');
                    wrapper.classList.remove('animate-signIn');
                }
            })
            .catch(error => {
                console.error("注册请求错误:", error);
                alert('请求失败: ' + error);
            });
        } else {
            // 登录逻辑
            const username = document.getElementById('LUsername').value;
            const password = document.getElementById('LPassword').value;
            
            console.log("登录信息:", { username, password: '***' });
            
            // 简单的输入验证
            if (!username || !password) {
                alert('请填写所有字段');
                return;
            }
            
            // 发送登录请求
            console.log("发送登录请求");
            fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                console.log("登录响应状态:", response.status);
                return response.json();
            })
            .then(data => {
                console.log("登录响应数据:", data);
                if (data.error) {
                    alert('登录失败: ' + data.error);
                } else {
                    alert('登录成功，欢迎 ' + data.username);
                    // 这里可以添加登录后的逻辑，例如重定向到主页
                }
            })
            .catch(error => {
                console.error("登录请求错误:", error);
                alert('请求失败: ' + error);
            });
        }
    });
});

// 在页面加载时打印一些调试信息
document.addEventListener('DOMContentLoaded', () => {
    console.log("页面加载完成");
    console.log("按钮元素数量:", buttons.length);
    console.log("表单状态:", {
        hasAnimateSignIn: wrapper.classList.contains('animate-signIn'),
        hasAnimateSignUp: wrapper.classList.contains('animate-signUp')
    });
});