// BloodLine Admin Dashboard - Vanilla JavaScript
let donors = JSON.parse(localStorage.getItem('bloodline_donors') || '[]');
let emergencies = JSON.parse(localStorage.getItem('bloodline_emergencies') || '[]');

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
  initializeAdminDashboard();
});

function initializeAdminDashboard() {
  updateStats();
  renderBloodGroupStats();
  renderAdminDonorsTable();
  renderAdminEmergencyList();
}

// Update statistics
function updateStats() {
  const totalDonorsEl = document.getElementById('totalDonors');
  const totalEmergenciesEl = document.getElementById('totalEmergencies');
  const rareDonorsEl = document.getElementById('rareDonors');
  const activeGroupsEl = document.getElementById('activeGroups');
  
  if (totalDonorsEl) {
    totalDonorsEl.textContent = donors.length;
  }
  
  if (totalEmergenciesEl) {
    totalEmergenciesEl.textContent = emergencies.length;
  }
  
  // Count rare blood groups (O-, AB-)
  const rareCount = donors.filter(d => d.bloodGroup === 'O-' || d.bloodGroup === 'AB-').length;
  if (rareDonorsEl) {
    rareDonorsEl.textContent = rareCount;
  }
  
  // Count unique blood groups
  const uniqueGroups = new Set(donors.map(d => d.bloodGroup));
  if (activeGroupsEl) {
    activeGroupsEl.textContent = uniqueGroups.size;
  }
}

// Render blood group statistics
function renderBloodGroupStats() {
  const statsDiv = document.getElementById('bloodGroupStats');
  if (!statsDiv) return;
  
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const counts = {};
  
  bloodGroups.forEach(group => {
    counts[group] = donors.filter(d => d.bloodGroup === group).length;
  });
  
  statsDiv.innerHTML = bloodGroups.map(group => `
    <div class="blood-group-stat">
      <span class="blood-group-name">${group}</span>
      <span class="blood-group-count">${counts[group]}</span>
    </div>
  `).join('');
}

// Render admin donors table
function renderAdminDonorsTable() {
  const tableBody = document.getElementById('adminDonorsTable');
  const noDonorsDiv = document.getElementById('noAdminDonors');
  
  if (!tableBody) return;
  
  if (donors.length === 0) {
    tableBody.innerHTML = '';
    if (noDonorsDiv) noDonorsDiv.style.display = 'block';
    return;
  }
  
  if (noDonorsDiv) noDonorsDiv.style.display = 'none';
  
  // Sort by most recent first
  const sortedDonors = [...donors].sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
  
  tableBody.innerHTML = sortedDonors.map(donor => `
    <tr>
      <td><strong>${escapeHtml(donor.fullName)}</strong></td>
      <td><span class="blood-badge">${donor.bloodGroup}</span></td>
      <td>${escapeHtml(donor.cityArea)}</td>
      <td>${escapeHtml(donor.contactNumber)}</td>
       <td>
         <button class="btn-icon" onclick="editDonor(${donor.id})" title="Edit donor" style="color: var(--md-sys-color-primary);">
           <span class="material-symbols-rounded">edit</span>
         </button>
         <button class="btn-icon" onclick="deleteDonor(${donor.id})" title="Delete donor">
           <span class="material-symbols-rounded" style="color:#ba1a1a"">delete</span>
         </button>
       </td>
    </tr>
  `).join('');
}

// Render admin emergency list
function renderAdminEmergencyList() {
  const emergencyListDiv = document.getElementById('adminEmergencyList');
  const noEmergenciesDiv = document.getElementById('noAdminEmergencies');
  
  if (!emergencyListDiv) return;
  
  if (emergencies.length === 0) {
    emergencyListDiv.innerHTML = '';
    if (noEmergenciesDiv) noEmergenciesDiv.style.display = 'block';
    return;
  }
  
  if (noEmergenciesDiv) noEmergenciesDiv.style.display = 'none';
  
  emergencyListDiv.innerHTML = emergencies.map(emergency => `
    <div class="admin-emergency-item">
      <div class="admin-emergency-info">
        <div class="admin-emergency-header">
          <span class="admin-emergency-badge">${emergency.bloodGroup}</span>
          <span class="admin-emergency-badge" style="background-color: #d32f2f;">${emergency.status}</span>
          <small style="color: var(--md-sys-color-on-error-container); opacity: 0.8;">
            ${formatDate(emergency.createdAt)}
          </small>
        </div>
        <div class="admin-emergency-location">
          <span class="material-symbols-rounded" style="font-size: 1rem;">local_hospital</span>
          <span>${escapeHtml(emergency.location)}</span>
        </div>
        <div class="admin-emergency-details">
          ${escapeHtml(emergency.details)}
        </div>
      </div>
      <div style="display:flex; gap:0.5rem;">
        <button class="btn-icon" onclick="editEmergency(${emergency.id})" title="Edit emergency request" style="color: var(--md-sys-color-primary);">
          <span class="material-symbols-rounded">edit</span>
        </button>
        <button class="btn-icon" onclick="deleteEmergency(${emergency.id})" title="Delete emergency request" style="color: var(--md-sys-color-error);">
          <span class="material-symbols-rounded" style="color:#ba1a1a"">delete</span>
        </button>
      </div>
    </div>
  `).join('');
}

// Edit donor
function editDonor(donorId) {
  const donor = donors.find(d => d.id === donorId);
  if (!donor) return;
  const name = prompt('Full Name:', donor.fullName);
  if (name === null) return;
  const blood = prompt('Blood Group:', donor.bloodGroup);
  if (blood === null) return;
  const area = prompt('City Area:', donor.cityArea);
  if (area === null) return;
  const phone = prompt('Contact Number:', donor.contactNumber);
  if (phone === null) return;
  donor.fullName = name.trim() || donor.fullName;
  donor.bloodGroup = blood.trim() || donor.bloodGroup;
  donor.cityArea = area.trim() || donor.cityArea;
  donor.contactNumber = phone.trim() || donor.contactNumber;
  localStorage.setItem('bloodline_donors', JSON.stringify(donors));
  updateStats();
  renderBloodGroupStats();
  renderAdminDonorsTable();
}

// Edit emergency
function editEmergency(emergencyId) {
  const emergency = emergencies.find(e => e.id === emergencyId);
  if (!emergency) return;
  const bg = prompt('Blood Group:', emergency.bloodGroup);
  if (bg === null) return;
  const loc = prompt('Location:', emergency.location);
  if (loc === null) return;
  const urg = prompt('Urgency (Critical/Urgent):', emergency.status);
  if (urg === null) return;
  const det = prompt('Details:', emergency.details);
  if (det === null) return;
  emergency.bloodGroup = bg.trim() || emergency.bloodGroup;
  emergency.location = loc.trim() || emergency.location;
  emergency.status = urg.trim() || emergency.status;
  emergency.details = det.trim() || emergency.details;
  localStorage.setItem('bloodline_emergencies', JSON.stringify(emergencies));
  updateStats();
  renderAdminEmergencyList();
}
function deleteDonor(donorId) {
  if (confirm('Are you sure you want to delete this donor?')) {
    donors = donors.filter(d => d.id !== donorId);
    localStorage.setItem('bloodline_donors', JSON.stringify(donors));
    updateStats();
    renderBloodGroupStats();
    renderAdminDonorsTable();
  }
}

// Delete emergency
function deleteEmergency(emergencyId) {
  if (confirm('Are you sure you want to delete this emergency request?')) {
    emergencies = emergencies.filter(e => e.id !== emergencyId);
    localStorage.setItem('bloodline_emergencies', JSON.stringify(emergencies));
    updateStats();
    renderAdminEmergencyList();
  }
}

// Clear all donors
function clearAllDonors() {
  if (confirm('Are you sure you want to delete ALL donors? This action cannot be undone.')) {
    donors = [];
    localStorage.setItem('bloodline_donors', JSON.stringify(donors));
    updateStats();
    renderBloodGroupStats();
    renderAdminDonorsTable();
  }
}

// Clear all emergencies
function clearAllEmergencies() {
  if (confirm('Are you sure you want to delete ALL emergency requests? This action cannot be undone.')) {
    emergencies = [];
    localStorage.setItem('bloodline_emergencies', JSON.stringify(emergencies));
    updateStats();
    renderAdminEmergencyList();
  }
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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
