// Seed data for BloodLine.
// Runs before app.js / admin.js so the site never starts empty.
// It only fills localStorage when the keys do not exist yet, so any donor
// added or removed later is preserved.

(function () {
  var DONOR_KEY = 'bloodline_donors';
  var EMERGENCY_KEY = 'bloodline_emergencies';

  function daysAgo(days) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  }

  function hoursAgo(hours) {
    return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  }

  var seedDonors = [
    { id: 1,  fullName: 'Aarav Sharma',         bloodGroup: 'O-',  cityArea: 'Model Town, Ludhiana',        contactNumber: '+91 98140 23456', registeredAt: daysAgo(2)  },
    { id: 2,  fullName: 'Priya Kaur',           bloodGroup: 'B+',  cityArea: 'Ranjit Avenue, Amritsar',     contactNumber: '+91 98765 12340', registeredAt: daysAgo(4)  },
    { id: 3,  fullName: 'Rohan Mehta',          bloodGroup: 'A+',  cityArea: 'Civil Lines, Jalandhar',      contactNumber: '+91 98155 67890', registeredAt: daysAgo(5)  },
    { id: 4,  fullName: 'Simran Kaur Gill',     bloodGroup: 'O+',  cityArea: 'Sarabha Nagar, Ludhiana',     contactNumber: '+91 98720 44556', registeredAt: daysAgo(7)  },
    { id: 5,  fullName: 'Arjun Patel',          bloodGroup: 'AB+', cityArea: 'Karol Bagh, New Delhi',       contactNumber: '+91 98110 22334', registeredAt: daysAgo(9)  },
    { id: 6,  fullName: 'Neha Verma',           bloodGroup: 'A-',  cityArea: 'Andheri West, Mumbai',        contactNumber: '+91 98200 55667', registeredAt: daysAgo(11) },
    { id: 7,  fullName: 'Vikram Singh Rathore', bloodGroup: 'B-',  cityArea: 'Malviya Nagar, Jaipur',       contactNumber: '+91 98290 11223', registeredAt: daysAgo(13) },
    { id: 8,  fullName: 'Ananya Iyer',          bloodGroup: 'AB-', cityArea: 'Koramangala, Bengaluru',      contactNumber: '+91 98860 33445', registeredAt: daysAgo(15) },
    { id: 9,  fullName: 'Kabir Malhotra',       bloodGroup: 'O-',  cityArea: 'Rohini Sector 7, New Delhi',  contactNumber: '+91 98188 99001', registeredAt: daysAgo(18) },
    { id: 10, fullName: 'Ishita Kapoor',        bloodGroup: 'B+',  cityArea: 'Civil Lines, Ludhiana',       contactNumber: '+91 98726 77889', registeredAt: daysAgo(20) },
    { id: 11, fullName: 'Manpreet Singh',       bloodGroup: 'O+',  cityArea: 'Model Town Phase 2, Bathinda', contactNumber: '+91 98728 33441', registeredAt: daysAgo(23) },
    { id: 12, fullName: 'Divya Nair',           bloodGroup: 'A+',  cityArea: 'Kakkanad, Kochi',             contactNumber: '+91 98470 22110', registeredAt: daysAgo(25) },
    { id: 13, fullName: 'Aditya Deshmukh',      bloodGroup: 'B+',  cityArea: 'Baner, Pune',                 contactNumber: '+91 98500 66778', registeredAt: daysAgo(28) },
    { id: 14, fullName: 'Gurleen Kaur',         bloodGroup: 'O-',  cityArea: 'Urban Estate, Patiala',       contactNumber: '+91 98764 00912', registeredAt: daysAgo(30) },
    { id: 15, fullName: 'Rahul Yadav',          bloodGroup: 'AB+', cityArea: 'Gomti Nagar, Lucknow',        contactNumber: '+91 98390 44556', registeredAt: daysAgo(33) },
    { id: 16, fullName: 'Sneha Reddy',          bloodGroup: 'O+',  cityArea: 'Kukatpally, Hyderabad',       contactNumber: '+91 98480 11223', registeredAt: daysAgo(36) },
    { id: 17, fullName: 'Karan Ahuja',          bloodGroup: 'A-',  cityArea: 'Sector 34, Chandigarh',       contactNumber: '+91 98765 88990', registeredAt: daysAgo(39) },
    { id: 18, fullName: 'Tanvi Joshi',          bloodGroup: 'B-',  cityArea: 'Satellite, Ahmedabad',        contactNumber: '+91 98980 33445', registeredAt: daysAgo(42) }
  ];

  var seedEmergencies = [
    {
      id: 1,
      bloodGroup: 'O-',
      location: 'DMC Hospital, Tagore Nagar, Ludhiana',
      urgency: 'Critical',
      details: 'Trauma patient, surgery in 2 hours. Three units of O- red cells requested. Contact: 98140 23456.',
      status: 'Critical',
      createdAt: hoursAgo(2)
    },
    {
      id: 2,
      bloodGroup: 'B-',
      location: 'Fortis Escorts, Ranjit Avenue, Amritsar',
      urgency: 'Urgent',
      details: 'Scheduled cardiac surgery tomorrow morning. One unit of B- preferred; compatible alternatives accepted.',
      status: 'Urgent',
      createdAt: hoursAgo(20)
    }
  ];

  if (localStorage.getItem(DONOR_KEY) === null) {
    localStorage.setItem(DONOR_KEY, JSON.stringify(seedDonors));
  }

  if (localStorage.getItem(EMERGENCY_KEY) === null) {
    localStorage.setItem(EMERGENCY_KEY, JSON.stringify(seedEmergencies));
  }
})();
