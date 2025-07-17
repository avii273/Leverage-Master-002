document.addEventListener('DOMContentLoaded', async function() {
    // DOM Elements
    const userNameInput = document.getElementById('userNameInput');
    const userEmail = document.getElementById('userEmail');
    const accessKey = document.getElementById('accessKey');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const verifyBtn = document.getElementById('verifyBtn');
    const messageDiv = document.getElementById('message');
    const calculatorSection = document.getElementById('calculatorSection');
    const adminSection = document.getElementById('adminSection');
    const themeToggle = document.getElementById('themeToggle');
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuContent = document.getElementById('menuContent');
    const closeMenu = document.getElementById('closeMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileImage = document.getElementById('profileImage');
    const editProfileImage = document.getElementById('editProfileImage');
    const userNameDisplay = document.getElementById('userName');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const logoutBtn = document.getElementById('logoutBtn');
    const capitalInput = document.getElementById('capital');
    const marginInput = document.getElementById('margin');
    const stopLossInput = document.getElementById('stopLoss');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultCard = document.getElementById('resultCard');
    const leverageResult = document.getElementById('leverageResult');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const offlineMessage = document.querySelector('.offline-message');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const imageModal = document.getElementById('imageModal');
    const closeImageModal = document.getElementById('closeImageModal');
    const imageUpload = document.getElementById('imageUpload');
    const adminTableBody = document.getElementById('adminTableBody');
    const adminSearch = document.getElementById('adminSearch');
    const downloadBtn = document.getElementById('downloadBtn');
    const confirmNameChange = document.getElementById('confirmNameChange');
    const currentName = document.getElementById('currentName');
    const newName = document.getElementById('newName');
    const changeNameKey = document.getElementById('changeNameKey');
    const currentEmail = document.getElementById('currentEmail');
    const newEmail = document.getElementById('newEmail');
    const changeEmailKey = document.getElementById('changeEmailKey');
    const confirmEmailChange = document.getElementById('confirmEmailChange');
    const contactBtn = document.getElementById('contactBtn');
    const contactModal = document.getElementById('contactModal');
    const closeContactModal = document.getElementById('closeContactModal');
    const mainHeader = document.getElementById('mainHeader');
    const mainFooter = document.getElementById('mainFooter');

    // State
    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    let isAdmin = false;
    let users = [];
    let sessions = [];
    let currentUser = null;
    let currentSession = null;
    
    // Initialize
    initTheme();
    checkNetworkStatus();
    await loadData();
    await checkSession();
    
    // Event Listeners
    userNameInput.addEventListener('input', handleNameInput);
    userEmail.addEventListener('input', handleEmailInput);
    accessKey.addEventListener('input', handleAccessKeyInput);
    verifyBtn.addEventListener('click', verifyAccess);
    termsCheckbox.addEventListener('change', handleTermsChange);
    themeToggle.addEventListener('click', toggleTheme);
    menuToggle.addEventListener('click', openMenu);
    menuOverlay.addEventListener('click', closeMenuHandler);
    closeMenu.addEventListener('click', closeMenuHandler);
    closeMenuBtn.addEventListener('click', closeMenuHandler);
    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsHandler);
    logoutBtn.addEventListener('click', logout);
    capitalInput.addEventListener('input', handleCapitalInput);
    marginInput.addEventListener('input', handleMarginInput);
    stopLossInput.addEventListener('input', handleStopLossInput);
    calculateBtn.addEventListener('click', calculateLeverage);
    adminLogoutBtn.addEventListener('click', adminLogout);
    editProfileImage.addEventListener('click', openImageUpload);
    closeImageModal.addEventListener('click', closeImageUpload);
    imageUpload.addEventListener('change', handleImageUpload);
    adminSearch.addEventListener('input', filterAdminTable);
    downloadBtn.addEventListener('click', downloadData);
    confirmNameChange.addEventListener('click', changeName);
    confirmEmailChange.addEventListener('click', changeEmail);
    contactBtn.addEventListener('click', openContactModal);
    closeContactModal.addEventListener('click', closeContactModalHandler);
    
    // Network status
    window.addEventListener('online', () => {
        offlineMessage.style.display = 'none';
    });
    
    window.addEventListener('offline', () => {
        offlineMessage.style.display = 'block';
    });

    // Functions
    function initTheme() {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode);
        initTheme();
    }
    
    function clearMessages() {
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }
    
    function handleNameInput() {
        if (userNameInput.value.trim() !== '') {
            userEmail.disabled = false;
        } else {
            userEmail.disabled = true;
            userEmail.value = '';
            accessKey.disabled = true;
            accessKey.value = '';
            termsCheckbox.disabled = true;
            termsCheckbox.checked = false;
            verifyBtn.disabled = true;
        }
    }
    
    function handleEmailInput() {
        if (userEmail.value.trim() !== '') {
            accessKey.disabled = false;
        } else {
            accessKey.disabled = true;
            accessKey.value = '';
            termsCheckbox.disabled = true;
            termsCheckbox.checked = false;
            verifyBtn.disabled = true;
        }
    }
    
    function handleAccessKeyInput() {
        if (accessKey.value.trim() !== '') {
            termsCheckbox.disabled = false;
        } else {
            termsCheckbox.disabled = true;
            termsCheckbox.checked = false;
            verifyBtn.disabled = true;
        }
    }
    
    function handleTermsChange() {
        verifyBtn.disabled = !termsCheckbox.checked;
    }
    
    async function verifyAccess() {
        const key = accessKey.value.trim();
        const name = userNameInput.value.trim();
        const email = userEmail.value.trim();
        const deviceId = generateDeviceId();
        const now = new Date();
        
        clearMessages();
        
        // Validate inputs
        if (!name || !email || !key) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (!termsCheckbox.checked) {
            showMessage('You must accept the Terms and Conditions', 'error');
            return;
        }
        
        // Check for admin key
        if (accessKeys.admin.includes(key)) {
            isAdmin = true;
            adminSection.style.display = 'block';
            document.querySelector('.verification-section').style.display = 'none';
            mainHeader.style.display = 'none';
            mainFooter.style.display = 'none';
            showMessage('Admin access granted', 'success');
            
            // Save admin session
            localStorage.setItem('adminSession', 'active');
            await updateAdminDashboard();
            return;
        }
        
        // Find user with this key or check if it's a valid new key
        let user = users.find(u => u.key === key);
        let packageType = null;
        
        if (!user) {
            // Check if key is valid
            if (accessKeys.monthly.includes(key)) {
                packageType = 'monthly';
            } else if (accessKeys.threeMonths.includes(key)) {
                packageType = '3months';
            } else if (accessKeys.lifetime.includes(key)) {
                packageType = 'lifetime';
            }
            
            if (!packageType) {
                showMessage('Invalid Access Key', 'error');
                return;
            }
            
            // Create new user
            user = {
                key: key,
                package: packageType,
                status: 'active',
                usage_count: 1,
                activated_time: now.toISOString(),
                name: name,
                email: email,
                note: 'Auto-created on first use'
            };
            
            // Set expiration date
            let expirationDate = new Date();
            if (packageType === 'monthly') {
                expirationDate.setDate(expirationDate.getDate() + 30);
            } else if (packageType === '3months') {
                expirationDate.setDate(expirationDate.getDate() + 90);
            }
            user.expired_time = expirationDate.toISOString();
            
            users.push(user);
        } else {
            // Existing user - verify
            if (user.status === 'blocked') {
                showMessage('Key has been blocked', 'error');
                return;
            }
            
            if (user.name && user.email && (user.name !== name || user.email !== email)) {
                showMessage('Invalid Name or Email for this key', 'error');
                return;
            }
            
            // Update existing user
            user.status = 'active';
            user.usage_count = (user.usage_count || 0) + 1;
            user.activated_time = user.activated_time || now.toISOString();
            user.name = name;
            user.email = email;
        }
        
        // Handle device login/session
        await handleDeviceLogin(user, key);
        
        // Set current user
        currentUser = user;
        localStorage.setItem('currentUserKey', key);
        
        // Show calculator and hide verification
        calculatorSection.style.display = 'block';
        document.querySelector('.verification-section').style.display = 'none';
        mainHeader.style.display = 'flex';
        mainFooter.style.display = 'block';
        
        // Update UI
        userNameDisplay.textContent = name;
        profileName.textContent = name;
        profileEmail.textContent = email;
        
        showMessage('Access Granted!', 'success');
    }
    
    async function handleDeviceLogin(user, key) {
        const deviceId = generateDeviceId();
        const now = new Date();
        
        // Check for existing active session with this key
        const existingSession = sessions.find(s => s.key === key && s.active);
        
        if (existingSession) {
            // Invalidate previous session
            existingSession.active = false;
            existingSession.logout_time = now.toISOString();
            
            // Notify previous device if possible (would require a more advanced setup)
            console.log(`Logged out previous session for key ${key}`);
        }
        
        // Create new session
        const newSession = {
            key: key,
            device_id: deviceId,
            login_time: now.toISOString(),
            active: true,
            user_agent: navigator.userAgent
        };
        
        sessions.push(newSession);
        currentSession = newSession;
        
        // Save to storage
        await saveData();
    }
    
    function generateDeviceId() {
        const navigatorKeys = [
            navigator.userAgent,
            navigator.platform,
            navigator.hardwareConcurrency,
            navigator.deviceMemory,
            screen.width,
            screen.height,
            new Date().getTimezoneOffset()
        ].join('|');
        
        return btoa(navigatorKeys).substring(0, 32);
    }
    
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + type;
        messageDiv.style.display = 'block';
    }
    
    function openMenu() {
        menuContent.classList.add('active');
        menuOverlay.style.display = 'block';
    }
    
    function closeMenuHandler() {
        menuContent.classList.remove('active');
        menuOverlay.style.display = 'none';
    }
    
    function openSettings() {
        if (!currentUser) return;
        
        currentName.value = currentUser.name;
        newName.value = currentUser.name;
        changeNameKey.value = currentUser.key;
        
        currentEmail.value = currentUser.email;
        newEmail.value = currentUser.email;
        changeEmailKey.value = currentUser.key;
        
        settingsModal.style.display = 'flex';
        closeMenuHandler();
    }
    
    function closeSettingsHandler() {
        settingsModal.style.display = 'none';
    }
    
    function openContactModal() {
        contactModal.style.display = 'flex';
        closeMenuHandler();
    }
    
    function closeContactModalHandler() {
        contactModal.style.display = 'none';
    }
    
    async function logout() {
        // Mark session as inactive
        if (currentSession) {
            currentSession.active = false;
            currentSession.logout_time = new Date().toISOString();
            await saveData();
        }
        
        // Clear current user
        currentUser = null;
        currentSession = null;
        localStorage.removeItem('currentUserKey');
        localStorage.removeItem('adminSession');
        
        // Reset UI
        calculatorSection.style.display = 'none';
        adminSection.style.display = 'none';
        document.querySelector('.verification-section').style.display = 'block';
        mainHeader.style.display = 'none';
        mainFooter.style.display = 'none';
        userNameDisplay.textContent = '';
        
        // Clear messages
        clearMessages();
        
        // Reset form
        userNameInput.value = '';
        userEmail.value = '';
        accessKey.value = '';
        termsCheckbox.checked = false;
        userEmail.disabled = true;
        accessKey.disabled = true;
        termsCheckbox.disabled = true;
        verifyBtn.disabled = true;
        
        closeMenuHandler();
    }
    
    function adminLogout() {
        isAdmin = false;
        localStorage.removeItem('adminSession');
        adminSection.style.display = 'none';
        document.querySelector('.verification-section').style.display = 'block';
        mainHeader.style.display = 'none';
        mainFooter.style.display = 'none';
        
        clearMessages();
    }
    
    function handleCapitalInput() {
        if (capitalInput.value > 0) {
            marginInput.disabled = false;
        } else {
            marginInput.disabled = true;
            marginInput.value = '';
            stopLossInput.disabled = true;
            stopLossInput.value = '';
            calculateBtn.disabled = true;
            resultCard.style.display = 'none';
        }
    }
    
    function handleMarginInput() {
        const capital = parseFloat(capitalInput.value);
        const margin = parseFloat(marginInput.value);
        
        if (margin > capital) {
            marginInput.value = capital;
        }
        
        if (margin > 0) {
            stopLossInput.disabled = false;
        } else {
            stopLossInput.disabled = true;
            stopLossInput.value = '';
            calculateBtn.disabled = true;
            resultCard.style.display = 'none';
        }
    }
    
    function handleStopLossInput() {
        const stopLoss = parseFloat(stopLossInput.value);
        
        if (stopLoss > 100) {
            stopLossInput.value = 100;
        }
        
        calculateBtn.disabled = !(stopLoss > 0);
    }
    
    function calculateLeverage() {
        const capital = parseFloat(capitalInput.value);
        const margin = parseFloat(marginInput.value);
        const stopLoss = parseFloat(stopLossInput.value);

        // Validate inputs
        if (isNaN(capital) || capital <= 0) return;
        if (isNaN(margin) || margin <= 0) return;
        if (isNaN(stopLoss) || stopLoss <= 0) return;

        // Calculate leverage
        const leverage = (margin * 100) / (margin * stopLoss);
        leverageResult.textContent = Math.round(leverage);
        resultCard.style.display = 'block';
    }
    
    function checkNetworkStatus() {
        if (!navigator.onLine) {
            offlineMessage.style.display = 'block';
        }
    }
    
    function openImageUpload() {
        imageModal.style.display = 'flex';
        closeMenuHandler();
    }
    
    function closeImageUpload() {
        imageModal.style.display = 'none';
    }
    
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            profileImage.innerHTML = '';
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            profileImage.appendChild(img);
            
            const editIcon = document.createElement('div');
            editIcon.className = 'edit-icon';
            editIcon.innerHTML = '<i class="fas fa-pen"></i>';
            editIcon.addEventListener('click', openImageUpload);
            profileImage.appendChild(editIcon);
            
            localStorage.setItem('profileImage', event.target.result);
        };
        reader.readAsDataURL(file);
        closeImageUpload();
    }
    
    async function loadData() {
        try {
            const data = await loadData();
            users = data.users || [];
            sessions = data.sessions || [];
            
            // Load profile image if exists
            const savedImage = localStorage.getItem('profileImage');
            if (savedImage) {
                updateProfileImage(savedImage);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            // Fallback to localStorage
            const savedUsers = localStorage.getItem('users');
            if (savedUsers) users = JSON.parse(savedUsers);
            
            const savedSessions = localStorage.getItem('sessions');
            if (savedSessions) sessions = JSON.parse(savedSessions);
        }
    }
    
    function updateProfileImage(imageData) {
        profileImage.innerHTML = '';
        const img = document.createElement('img');
        img.src = imageData;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        profileImage.appendChild(img);
        
        const editIcon = document.createElement('div');
        editIcon.className = 'edit-icon';
        editIcon.innerHTML = '<i class="fas fa-pen"></i>';
        editIcon.addEventListener('click', openImageUpload);
        profileImage.appendChild(editIcon);
    }
    
    async function saveData() {
        try {
            await saveData(users, sessions);
        } catch (error) {
            console.error("Error saving data:", error);
            // Fallback to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('sessions', JSON.stringify(sessions));
        }
    }
    
    async function updateAdminDashboard() {
        // Update stats
        document.getElementById('allKeys').textContent = users.length;
        document.getElementById('monthlyKeys').textContent = users.filter(u => u.package === 'monthly').length;
        document.getElementById('threeMonthKeys').textContent = users.filter(u => u.package === '3months').length;
        document.getElementById('lifetimeKeys').textContent = users.filter(u => u.package === 'lifetime').length;
        document.getElementById('activeKeys').textContent = users.filter(u => u.status === 'active').length;
        document.getElementById('blockedKeys').textContent = users.filter(u => u.status === 'blocked').length;
        document.getElementById('expiredKeys').textContent = users.filter(u => {
            return u.expired_time && new Date(u.expired_time) < new Date() && u.status !== 'blocked';
        }).length;
        
        // Update table
        adminTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            
            let statusClass = '';
            if (user.status === 'active') statusClass = 'status-active';
            else if (user.status === 'blocked') statusClass = 'status-blocked';
            else if (user.expired_time && new Date(user.expired_time) < new Date()) statusClass = 'status-expired';
            else statusClass = 'status-inactive';
            
            const expiredDisplay = user.expired_time ? new Date(user.expired_time).toLocaleDateString() : '-';
            const activatedDisplay = user.activated_time ? new Date(user.activated_time).toLocaleDateString() : '-';
            
            row.innerHTML = `
                <td>${user.key}</td>
                <td>${user.package}</td>
                <td class="${statusClass}">${user.status || 'inactive'}</td>
                <td>${user.device_id || '-'}</td>
                <td>${user.usage_count || 0}</td>
                <td>${activatedDisplay}</td>
                <td>${expiredDisplay}</td>
                <td><input type="text" class="edit-field" data-field="name" data-key="${user.key}" value="${user.name || ''}"></td>
                <td><input type="text" class="edit-field" data-field="email" data-key="${user.key}" value="${user.email || ''}"></td>
                <td><input type="text" class="edit-field" data-field="note" data-key="${user.key}" value="${user.note || ''}"></td>
                <td>
                    <button class="btn-action btn-small" data-action="toggle" data-key="${user.key}">
                        ${user.status === 'blocked' ? 'Activate' : 'Block'}
                    </button>
                    <button class="btn-action btn-small" data-action="delete" data-key="${user.key}">Delete</button>
                </td>
            `;
            
            adminTableBody.appendChild(row);
        });
        
        document.querySelectorAll('.btn-action').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const key = this.getAttribute('data-key');
                
                if (action === 'toggle') {
                    toggleUserStatus(key);
                } else if (action === 'delete') {
                    deleteUser(key);
                }
            });
        });
        
        document.querySelectorAll('.edit-field').forEach(field => {
            field.addEventListener('change', function() {
                const fieldName = this.getAttribute('data-field');
                const key = this.getAttribute('data-key');
                const value = this.value;
                updateUserField(key, fieldName, value);
            });
        });
    }
    
    async function updateUserField(key, field, value) {
        const user = users.find(u => u.key === key);
        if (!user) return;
        
        user[field] = value;
        await saveData();
        
        if (currentUser && currentUser.key === key) {
            if (field === 'name') {
                profileName.textContent = value;
                userNameDisplay.textContent = value;
            } else if (field === 'email') {
                profileEmail.textContent = value;
            }
        }
    }
    
    async function toggleUserStatus(key) {
        const user = users.find(u => u.key === key);
        if (!user) return;
        
        user.status = user.status === 'blocked' ? 'active' : 'blocked';
        await saveData();
        await updateAdminDashboard();
    }
    
    async function deleteUser(key) {
        if (confirm('Are you sure you want to delete this key?')) {
            users = users.filter(u => u.key !== key);
            sessions = sessions.filter(s => s.key !== key);
            await saveData();
            await updateAdminDashboard();
        }
    }
    
    function filterAdminTable() {
        const searchTerm = adminSearch.value.toLowerCase();
        const rows = adminTableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }
    
    function downloadData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "users_data.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }
    
    async function changeName() {
        const currentNameValue = currentName.value.trim();
        const newNameValue = newName.value.trim();
        const key = changeNameKey.value.trim();
        
        if (!currentNameValue || !newNameValue || !key) {
            alert('All fields are required');
            return;
        }
        
        if (currentNameValue === newNameValue) {
            alert('New name must be different from current name');
            return;
        }
        
        const user = users.find(u => u.key === key && u.name === currentNameValue);
        if (!user) {
            alert('Invalid credentials');
            return;
        }
        
        user.name = newNameValue;
        await saveData();
        
        profileName.textContent = newNameValue;
        userNameDisplay.textContent = newNameValue;
        
        if (isAdmin) {
            await updateAdminDashboard();
        }
        
        alert('Name changed successfully');
        closeSettingsHandler();
    }
    
    async function changeEmail() {
        const currentEmailValue = currentEmail.value.trim();
        const newEmailValue = newEmail.value.trim();
        const key = changeEmailKey.value.trim();
        
        if (!currentEmailValue || !newEmailValue || !key) {
            alert('All fields are required');
            return;
        }
        
        if (currentEmailValue === newEmailValue) {
            alert('New email must be different from current email');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmailValue)) {
            alert('Please enter a valid email address');
            return;
        }
        
        const user = users.find(u => u.key === key && u.email === currentEmailValue);
        if (!user) {
            alert('Invalid credentials');
            return;
        }
        
        user.email = newEmailValue;
        await saveData();
        
        profileEmail.textContent = newEmailValue;
        
        if (isAdmin) {
            await updateAdminDashboard();
        }
        
        alert('Email changed successfully');
        closeSettingsHandler();
    }
    
    async function checkSession() {
        clearMessages();
        
        // Check for admin session
        if (localStorage.getItem('adminSession') === 'active') {
            isAdmin = true;
            adminSection.style.display = 'block';
            document.querySelector('.verification-section').style.display = 'none';
            mainHeader.style.display = 'none';
            mainFooter.style.display = 'none';
            await updateAdminDashboard();
            return;
        }
        
        // Check for user session
        const userKey = localStorage.getItem('currentUserKey');
        if (userKey) {
            const user = users.find(u => u.key === userKey);
            if (user) {
                // Check for active session
                const activeSession = sessions.find(s => 
                    s.key === userKey && 
                    s.active && 
                    s.device_id === generateDeviceId()
                );
                
                if (!activeSession) {
                    // Session is invalid (logged in from another device)
                    localStorage.removeItem('currentUserKey');
                    showMessage('Logged in from another device', 'error');
                    return;
                }
                
                currentUser = user;
                currentSession = activeSession;
                
                // Show calculator and hide verification
                calculatorSection.style.display = 'block';
                document.querySelector('.verification-section').style.display = 'none';
                mainHeader.style.display = 'flex';
                mainFooter.style.display = 'block';
                
                // Update UI
                userNameDisplay.textContent = user.name;
                profileName.textContent = user.name;
                profileEmail.textContent = user.email;
                
                // Load profile image if exists
                const savedImage = localStorage.getItem('profileImage');
                if (savedImage) {
                    updateProfileImage(savedImage);
                }
            }
        }
    }
});