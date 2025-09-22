function showForm(formId) {
    // Hide all forms and show options
    hideAllForms();
    
    // Hide options and show selected form
    document.querySelector('.auth-options').style.display = 'none';
    document.getElementById(formId).classList.remove('hidden');
}

function hideForm() {
    // Hide all forms and show options
    hideAllForms();
    document.querySelector('.auth-options').style.display = 'grid';
}

function hideAllForms() {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.classList.add('hidden');
    });
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const formType = form.closest('.auth-form').id;
            
            // Basic validation
            if (validateForm(form)) {
                handleFormSubmission(formType, formData);
            }
        });
    });
});

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e53e3e';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return isValid;
}

function handleFormSubmission(formType, formData) {
    // Simulate form submission
    console.log(`Submitting ${formType} form:`, Object.fromEntries(formData));
    
    // Redirect based on user type
    if (formType === 'login') {
        // In a real app, determine user type from backend response
        const userType = prompt('Enter user type for demo (company/researcher):');
        if (userType === 'company') {
            window.location.href = 'company-dashboard.html';
        } else if (userType === 'researcher') {
            window.location.href = 'researcher-dashboard.html';
        }
    } else if (formType === 'company-signup') {
        alert('Company account created successfully!');
        window.location.href = 'company-dashboard.html';
    } else if (formType === 'hacker-signup') {
        alert('Researcher account created successfully!');
        window.location.href = 'researcher-dashboard.html';
    }
}
