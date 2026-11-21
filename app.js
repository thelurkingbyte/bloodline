// BloodLine App - Vanilla JavaScript
// Data Storage using localStorage
let donors = JSON.parse(localStorage.getItem('bloodline_donors') || '[]');
let emergencies = JSON.parse(localStorage.getItem('bloodline_emergencies') || '[]');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupDonorRegistrationForm();
  setupEmergencyForm();
  renderDonorsList();
  renderEmergencyList();
  renderEmergencyBanner();
  setupSmoothScrolling();
}

// Setup Donor Registration Form
function setupDonorRegistrationForm() {
  const form = document.getElementById('donorRegistrationForm');
  const messageDiv = document.getElementById('registrationMessage');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      const donor = {
        id: Date.now(),
        fullName: formData.get('fullName').trim(),
        bloodGroup: formData.get('bloodGroup'),
        cityArea: formData.get('cityArea').trim(),
        contactNumber: formData.get('contactNumber').trim(),
        registeredAt: new Date().toISOString()
      };
      
      // Validate
      if (!donor.fullName || !donor.bloodGroup || !donor.cityArea || !donor.contactNumber) {
        showMessage(messageDiv, 'Please fill in all fields', 'error');
        return;
      }
      
      // Check if donor already exists with same phone number
      const existingDonor = donors.find(d => d.contactNumber === donor.contactNumber);
      if (existingDonor) {
        showMessage(messageDiv, 'A donor with this contact number already exists', 'error');
        return;
      }
      
      // Add donor
      donors.push(donor);
      localStorage.setItem('bloodline_donors', JSON.stringify(donors));
      
      // Show success message
      showMessage(messageDiv, 'Donor registered successfully! Thank you for saving lives.', 'success');
      
      // Reset form
      form.reset();
      
      // Re-render donors list
      renderDonorsList();
      
      // Scroll to search section
      setTimeout(() => {
        document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    });
  }
}

// Setup Emergency Form
function setupEmergencyForm() {
  const form = document.getElementById('emergencyForm');
  const messageDiv = document.getElementById('emergencyMessage');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
       const emergency = {
         id: Date.now(),
         bloodGroup: formData.get('emergencyBloodGroup'),
         location: formData.get('emergencyLocation').trim(),
         urgency: formData.get('emergencyUrgency'),
         details: formData.get('emergencyDetails').trim(),
         status: formData.get('emergencyUrgency') || 'URGENT',
         createdAt: new Date().toISOString()
       };
      
      // Validate
       if (!emergency.bloodGroup || !emergency.location || !emergency.urgency || !emergency.details) {
        showMessage(messageDiv, 'Please fill in all fields', 'error');
        return;
      }
      
      // Add emergency
      emergencies.unshift(emergency);
      localStorage.setItem('bloodline_emergencies', JSON.stringify(emergencies));
      
      // Show success message
      showMessage(messageDiv, 'Emergency request broadcasted successfully!', 'success');
      
      // Reset form
      form.reset();
      
      // Re-render emergency list and banner
      renderEmergencyList();
      renderEmergencyBanner();
      
      // Scroll to emergency list
      setTimeout(() => {
        const emergencyListSection = document.querySelector('.emergency-list-section');
        if (emergencyListSection) {
          emergencyListSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    });
  }
}

// Show message
function showMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = 'form-message ' + type;
  setTimeout(() => {
    element.className = 'form-message';
  }, 5000);
}

// Render Donors List with filtering
function renderDonorsList() {
  const donorsListDiv = document.getElementById('donorsList');
  const noDonorsDiv = document.getElementById('noDonorsMessage');
  
  if (!donorsListDiv) return;
  
  const bloodGroupFilter = document.getElementById('filterBloodGroup')?.value || 'all';
  const areaFilter = document.getElementById('filterArea')?.value.toLowerCase() || '';
  
  let filteredDonors = donors.filter(donor => {
    const bloodMatch = bloodGroupFilter === 'all' || donor.bloodGroup === bloodGroupFilter;
    const areaMatch = areaFilter === '' || donor.cityArea.toLowerCase().includes(areaFilter);
    return bloodMatch && areaMatch;
  });
  
  if (filteredDonors.length === 0) {
    donorsListDiv.innerHTML = '';
    if (noDonorsDiv) noDonorsDiv.style.display = 'block';
    return;
  }
  
  if (noDonorsDiv) noDonorsDiv.style.display = 'none';
  
  donorsListDiv.innerHTML = filteredDonors.map(donor => `
    <div class="donor-card">
      <div class="donor-avatar">
        ${getInitials(donor.fullName)}
      </div>
      <div class="donor-info">
        <div class="donor-name">${escapeHtml(donor.fullName)}</div>
        <div class="donor-details">
          <div class="donor-detail-item">
            <span class="material-symbols-rounded" style="font-size: 1rem;">location_on</span>
            <span>${escapeHtml(donor.cityArea)}</span>
          </div>
           <div class="donor-detail-item">
             <a href="tel:${escapeHtml(donor.contactNumber)}" style="color: var(--md-sys-color-primary);">
               <span class="material-symbols-rounded" style="font-size: 1rem;">call</span>
               <span>${escapeHtml(donor.contactNumber)}</span>
             </a>
           </div>
        </div>
      </div>
      <div class="donor-blood-group">
        ${donor.bloodGroup}
      </div>
    </div>
  `).join('');
}

// Filter donors function (called by onchange/oninput)
function filterDonors() {
  renderDonorsList();
}

// Get initials from name
function getInitials(name) {
  return name.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render Emergency List
function renderEmergencyList() {
  const emergencyListDiv = document.getElementById('emergencyList');
  if (!emergencyListDiv) return;
  
  if (emergencies.length === 0) {
    emergencyListDiv.innerHTML = '<p style="text-align: center; color: var(--md-sys-color-on-surface-variant); padding: 2rem;">No active emergency requests</p>';
    return;
  }
  
  emergencyListDiv.innerHTML = emergencies.slice(0, 10).map(emergency => `
    <div class="emergency-item">
      <div class="emergency-item-header">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <span class="emergency-blood-badge">${emergency.bloodGroup}</span>
          <span class="emergency-status">${emergency.status}</span>
        </div>
        <small style="color: var(--md-sys-color-on-error-container); opacity: 0.8;">
          ${formatDate(emergency.createdAt)}
        </small>
      </div>
      <div class="emergency-location">
        <span class="material-symbols-rounded" style="font-size: 1rem;">local_hospital</span>
        <span>${escapeHtml(emergency.location)}</span>
      </div>
      <div class="emergency-details">
        ${escapeHtml(emergency.details)}
      </div>
    </div>
  `).join('');
}

// Render Emergency Banner
function renderEmergencyBanner() {
  const banner = document.getElementById('emergencyBanner');
  const bannerText = document.getElementById('emergencyText');
  
  if (!banner || !bannerText) return;
  
  if (emergencies.length > 0) {
    const latestEmergency = emergencies[0];
     bannerText.innerHTML = `
       <strong style="color: #ffffff;">${latestEmergency.status} EMERGENCY:</strong> 
       Need <strong>${latestEmergency.bloodGroup}</strong> at <strong>${escapeHtml(latestEmergency.location)}</strong><br>
       <span style="font-weight:400;">${escapeHtml(latestEmergency.details)}</span>
     `;
    banner.classList.add('active');
  } else {
    banner.classList.remove('active');
  }
}

// Close Emergency Banner
function closeEmergencyBanner() {
  const banner = document.getElementById('emergencyBanner');
  if (banner) {
    banner.classList.remove('active');
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

// Close mobile menu
function closeMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.remove('active');
  }
}

// Setup smooth scrolling for anchor links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
        const targetPosition = targetElement.offsetTop - headerHeight - 10;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
