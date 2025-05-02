let currentUser = null;
let skills = [];

// 用户管理函数
function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
    document.getElementById('mainContainer').style.display = 'none';
}

function showMain() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
    document.getElementById('currentUser').textContent = currentUser;
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('请输入用户名和密码！');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username].password === password) {
        currentUser = username;
        showMain();
        loadUserSkills();
    } else {
        alert('用户名或密码错误！');
    }
}

function register() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !password) {
        alert('请输入用户名和密码！');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致！');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
        alert('用户名已存在！');
        return;
    }
    
    users[username] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    alert('注册成功！');
    showLogin();
}

function logout() {
    currentUser = null;
    skills = [];
    document.getElementById('skillsContainer').innerHTML = '';
    showLogin();
}

// 技能管理函数
function addNewSkill() {
    const input = document.getElementById('newSkill');
    const skillName = input.value.trim();
    
    if (skillName) {
        // 检查技能是否已存在
        const existingSkills = document.querySelectorAll('.skill-name');
        let skillExists = false;
        
        existingSkills.forEach(skill => {
            if (skill.textContent === skillName) {
                skillExists = true;
            }
        });
        
        if (!skillExists) {
            skills.push(skillName);
            createSkillElement(skillName);
            input.value = '';
            saveUserSkills();
        } else {
            alert('该技能已存在！');
        }
    }
}

function createSkillElement(skillName) {
    const container = document.getElementById('skillsContainer');
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.innerHTML = `
        <div class="skill-header">
            <span class="skill-name">${skillName}</span>
            <div class="skill-controls">
                <button onclick="adjustSkill('${skillName}', -0.5)">-0.5</button>
                <button onclick="adjustSkill('${skillName}', -1)">-1</button>
                <button onclick="adjustSkill('${skillName}', 0.5)">+0.5</button>
                <button onclick="adjustSkill('${skillName}', 1)">+1</button>
            </div>
        </div>
        <div class="grid-container" id="${skillName}-grid"></div>
        <div class="skill-value" id="${skillName}-value">0</div>
    `;
    container.appendChild(skillItem);
    
    // 创建格子
    const gridContainer = document.getElementById(`${skillName}-grid`);
    for (let i = 0; i < 10; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridContainer.appendChild(gridItem);
    }
}

function adjustSkill(skillName, amount) {
    const gridItems = document.querySelectorAll(`#${skillName}-grid .grid-item`);
    const valueDisplay = document.getElementById(`${skillName}-value`);
    let currentValue = parseFloat(valueDisplay.textContent) || 0;
    
    currentValue += amount;
    currentValue = Math.max(0, currentValue);
    
    const fullGrids = Math.floor(currentValue);
    const hasHalf = currentValue % 1 !== 0;
    
    gridItems.forEach((item, index) => {
        item.classList.remove('filled', 'half-filled');
        if (index < fullGrids) {
            item.classList.add('filled');
        } else if (index === fullGrids && hasHalf) {
            item.classList.add('half-filled');
        }
    });
    
    valueDisplay.textContent = currentValue.toFixed(1);
    saveUserSkills();
}

function saveUserSkills() {
    if (!currentUser) return;
    
    const skillsData = {};
    const skillElements = document.querySelectorAll('.skill-item');
    
    skillElements.forEach(skillElement => {
        const skillName = skillElement.querySelector('.skill-name').textContent;
        const valueDisplay = skillElement.querySelector('.skill-value');
        skillsData[skillName] = parseFloat(valueDisplay.textContent) || 0;
    });
    
    const userSkills = JSON.parse(localStorage.getItem('userSkills') || '{}');
    userSkills[currentUser] = skillsData;
    localStorage.setItem('userSkills', JSON.stringify(userSkills));
}

function loadUserSkills() {
    if (!currentUser) return;
    
    const userSkills = JSON.parse(localStorage.getItem('userSkills') || '{}');
    const skillsData = userSkills[currentUser] || {};
    
    // 清空现有技能
    document.getElementById('skillsContainer').innerHTML = '';
    skills = [];
    
    // 重新创建所有技能
    Object.entries(skillsData).forEach(([skillName, value]) => {
        skills.push(skillName);
        createSkillElement(skillName);
        adjustSkill(skillName, value);
    });
}

// 页面加载时显示登录界面
window.onload = showLogin; 