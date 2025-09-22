let availableTargets = [];
let myTests = [];
let selectedTarget = null;

document.addEventListener('DOMContentLoaded', function() {
    loadAvailableTargets();
    loadMyTests();
    
    // Form submission handler
    document.getElementById('start-test-form').addEventListener('submit', function(e) {
        e.preventDefault();
        startTest();
    });
});

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section and activate nav button
    document.getElementById(sectionName).classList.remove('hidden');
    event.target.classList.add('active');
}

function loadAvailableTargets() {
    const stored = localStorage.getItem('targets');
    availableTargets = stored ? JSON.parse(stored) : [];
    renderAvailableTargets();
}

function renderAvailableTargets() {
    const container = document.getElementById('available-targets');
    
    const filteredTargets = filterTargetsBySelection();
    
    if (filteredTargets.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No available targets match your criteria.</p>';
        return;
    }
    
    container.innerHTML = filteredTargets.map(target => `
        <div class="target-card">
            <div class="target-header">
                <div>
                    <h3>${target.name}</h3>
                    <div class="system-type">${target.type.replace('-', ' ').toUpperCase()}</div>
                </div>
                <span class="priority-badge priority-${target.priority}">${target.priority}</span>
            </div>
            <div class="target-url">${target.url}</div>
            <div class="target-description">${target.description}</div>
            ${target.restrictions ? `<div style="background: #fff5f5; padding: 8px; border-radius: 4px; font-size: 14px; margin-bottom: 15px;"><strong>Testing Restrictions:</strong> ${target.restrictions}</div>` : ''}
            <button onclick="requestTest(${target.id})" class="btn btn-primary">Request Test</button>
        </div>
    `).join('');
}

function filterTargets() {
    renderAvailableTargets();
}

function filterTargetsBySelection() {
    const typeFilter = document.getElementById('type-filter').value;
    const priorityFilter = document.getElementById('priority-filter').value;
    
    return availableTargets.filter(target => {
        const typeMatch = !typeFilter || target.type === typeFilter;
        const priorityMatch = !priorityFilter || target.priority === priorityFilter;
        return typeMatch && priorityMatch;
    });
}

function requestTest(targetId) {
    selectedTarget = availableTargets.find(t => t.id === targetId);
    showTestModal();
}

function showTestModal() {
    const modal = document.getElementById('test-modal');
    const detailsContainer = document.getElementById('target-details');
    
    detailsContainer.innerHTML = `
        <div style="background: #f7fafc; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <h4>${selectedTarget.name}</h4>
            <p><strong>Type:</strong> ${selectedTarget.type.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Priority:</strong> ${selectedTarget.priority.toUpperCase()}</p>
            <p><strong>URL:</strong> ${selectedTarget.url}</p>
            <p><strong>Description:</strong> ${selectedTarget.description}</p>
            ${selectedTarget.restrictions ? `<p><strong>Restrictions:</strong> ${selectedTarget.restrictions}</p>` : ''}
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function hideTestModal() {
    document.getElementById('test-modal').classList.add('hidden');
    document.getElementById('start-test-form').reset();
    selectedTarget = null;
}

function startTest() {
    const form = document.getElementById('start-test-form');
    const formData = new FormData(form);
    
    const test = {
        id: Date.now(),
        targetId: selectedTarget.id,
        targetName: selectedTarget.name,
        researcherName: 'Current Researcher', // In real app, get from user session
        testPlan: formData.get('testPlan'),
        estimatedHours: parseInt(formData.get('estimatedHours')),
        status: 'active',
        startedAt: new Date().toISOString(),
        findings: []
    };
    
    myTests.push(test);
    localStorage.setItem('myTests', JSON.stringify(myTests));
    
    // Also add to active tests for company dashboard
    let activeTests = JSON.parse(localStorage.getItem('activeTests') || '[]');
    activeTests.push(test);
    localStorage.setItem('activeTests', JSON.stringify(activeTests));
    
    renderMyTests();
    hideTestModal();
    
    alert('Penetration test started successfully!');
}

function loadMyTests() {
    const stored = localStorage.getItem('myTests');
    myTests = stored ? JSON.parse(stored) : [];
    renderMyTests();
}

function renderMyTests() {
    const container = document.getElementById('researcher-tests');
    
    if (myTests.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No active tests.</p>';
        return;
    }
    
    container.innerHTML = myTests.map(test => `
        <div class="test-item">
            <div class="test-header">
                <h3>${test.targetName}</h3>
                <span class="test-status status-${test.status}">${test.status.toUpperCase()}</span>
            </div>
            <p><strong>Started:</strong> ${new Date(test.startedAt).toLocaleDateString()}</p>
            <p><strong>Estimated Duration:</strong> ${test.estimatedHours} hours</p>
            <p><strong>Test Plan:</strong> ${test.testPlan}</p>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button onclick="addFinding(${test.id})" class="btn btn-primary">Add Finding</button>
                <button onclick="completeTest(${test.id})" class="btn btn-secondary">Complete Test</button>
            </div>
        </div>
    `).join('');
}

function addFinding(testId) {
    const finding = prompt('Describe the vulnerability or finding:');
    if (finding) {
        const test = myTests.find(t => t.id === testId);
        test.findings.push({
            id: Date.now(),
            description: finding,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('myTests', JSON.stringify(myTests));
        alert('Finding added successfully!');
    }
}

function completeTest(testId) {
    if (confirm('Are you sure you want to complete this test?')) {
        const test = myTests.find(t => t.id === testId);
        test.status = 'completed';
        test.completedAt = new Date().toISOString();
        
        localStorage.setItem('myTests', JSON.stringify(myTests));
        
        // Update active tests
        let activeTests = JSON.parse(localStorage.getItem('activeTests') || '[]');
        const activeTest = activeTests.find(t => t.id === testId);
        if (activeTest) {
            activeTest.status = 'completed';
            activeTest.completedAt = test.completedAt;
            localStorage.setItem('activeTests', JSON.stringify(activeTests));
        }
        
        renderMyTests();
        alert('Test completed successfully!');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'auth.html';
    }
}
