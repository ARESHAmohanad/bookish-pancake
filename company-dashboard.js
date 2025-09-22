let targets = [];
let activeTests = [];

document.addEventListener('DOMContentLoaded', function() {
    loadTargets();
    loadActiveTests();
    
    // Form submission handler
    document.getElementById('target-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addTarget();
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

function showAddTargetForm() {
    document.getElementById('add-target-form').classList.remove('hidden');
}

function hideAddTargetForm() {
    document.getElementById('add-target-form').classList.add('hidden');
    document.getElementById('target-form').reset();
}

function addTarget() {
    const form = document.getElementById('target-form');
    const formData = new FormData(form);
    
    const target = {
        id: Date.now(),
        name: formData.get('systemName'),
        url: formData.get('targetUrl'),
        type: formData.get('systemType'),
        priority: formData.get('priority'),
        description: formData.get('description'),
        restrictions: formData.get('restrictions'),
        status: 'available',
        createdAt: new Date().toISOString()
    };
    
    targets.push(target);
    localStorage.setItem('targets', JSON.stringify(targets));
    
    renderTargets();
    hideAddTargetForm();
    
    alert('Target system added successfully!');
}

function loadTargets() {
    const stored = localStorage.getItem('targets');
    targets = stored ? JSON.parse(stored) : [];
    renderTargets();
}

function renderTargets() {
    const container = document.getElementById('targets-list');
    
    if (targets.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No target systems added yet.</p>';
        return;
    }
    
    container.innerHTML = targets.map(target => `
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
            ${target.restrictions ? `<div style="background: #fff5f5; padding: 8px; border-radius: 4px; font-size: 14px; margin-bottom: 15px;"><strong>Restrictions:</strong> ${target.restrictions}</div>` : ''}
            <div style="display: flex; gap: 10px;">
                <button onclick="editTarget(${target.id})" class="btn btn-secondary">Edit</button>
                <button onclick="deleteTarget(${target.id})" class="btn btn-danger">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteTarget(targetId) {
    if (confirm('Are you sure you want to delete this target system?')) {
        targets = targets.filter(t => t.id !== targetId);
        localStorage.setItem('targets', JSON.stringify(targets));
        renderTargets();
    }
}

function loadActiveTests() {
    const stored = localStorage.getItem('activeTests');
    activeTests = stored ? JSON.parse(stored) : [];
    renderActiveTests();
}

function renderActiveTests() {
    const container = document.getElementById('active-tests');
    
    if (activeTests.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No active tests.</p>';
        return;
    }
    
    container.innerHTML = activeTests.map(test => `
        <div class="test-item">
            <div class="test-header">
                <h3>${test.targetName}</h3>
                <span class="test-status status-${test.status}">${test.status.toUpperCase()}</span>
            </div>
            <p><strong>Researcher:</strong> ${test.researcherName}</p>
            <p><strong>Started:</strong> ${new Date(test.startedAt).toLocaleDateString()}</p>
            <p><strong>Estimated Duration:</strong> ${test.estimatedHours} hours</p>
            <div style="margin-top: 15px;">
                <button onclick="viewTestDetails(${test.id})" class="btn btn-primary">View Details</button>
            </div>
        </div>
    `).join('');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'auth.html';
    }
}
