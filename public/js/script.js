$(document).ready(function() {
    // Handle registration form submission (for both student and admin)
    $('#registration-form').submit(function(event) {
      event.preventDefault();
      const name = $('#name').val();
      const email = $('#email').val();
      const password = $('#password').val();
      const role = $('#role').val();
  
      if (!role) {
        alert('Please select a role');
        return;
      }
  
      // Example AJAX request to backend for registration
      $.ajax({
        url: '/api/register', // Your backend registration endpoint
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, email, password, role }),
        success: function(response) {
          console.log('Registration successful:', response);
          alert('Registration successful');
          
          // Redirect based on role
          if (role === 'student') {
            window.location.href = 'student-dashboard.html';
          } else if (role === 'admin') {
            window.location.href = 'admin-dashboard.html';
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Registration failed:', textStatus, errorThrown);
          alert('Registration failed: ' + textStatus);
        }
      });
    });
  
    // Handle login form submission
    $('#login-form').submit(function(event) {
      event.preventDefault();
      const email = $('#login-email').val();
      const password = $('#login-password').val();
  
      // Example AJAX request to backend for login
      $.ajax({
        url: '/api/login', // Your backend login endpoint
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function(response) {
          console.log('Login successful:', response);
          alert('Login successful');
  
          // Redirect based on user role
          if (response.role === 'student') {
            window.location.href = 'student-dashboard.html';
          } else if (response.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Login failed:', textStatus, errorThrown);
          alert('Login failed: ' + textStatus);
        }
      });
    });
  
    // Handle logout button click
    $('#logout-btn').click(function() {
      // Example AJAX request to backend for logout (if needed)
      $.ajax({
        url: '/api/logout', // Your backend logout endpoint (if applicable)
        method: 'POST',
        success: function(response) {
          console.log('Logged out:', response);
          alert('Logged out');
          window.location.href = 'index.html'; // Redirect to landing page
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Logout failed:', textStatus, errorThrown);
          alert('Logout failed: ' + textStatus);
        }
      });
    });
  
    // Populate course list on student dashboard
    if ($('#course-select').length) {
      function loadCourses() {
        // Example AJAX request to fetch courses
        $.ajax({
          url: '/api/courses', // Your backend endpoint for fetching courses
          method: 'GET',
          success: function(response) {
            const courses = response.courses;
            const courseSelect = $('#course-select');
            const courseList = $('#course-list');
            const currentCourse = response.currentCourse; // Assume this is sent from the backend
  
            courseSelect.empty();
            courseList.empty();
  
            courses.forEach(course => {
              const isActive = course === currentCourse;
              courseSelect.append(`<option value="${course}" ${isActive ? 'selected' : ''}>${course}</option>`);
              courseList.append(`<li class="${isActive ? 'active' : 'inactive'}">${course}</li>`);
            });
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to load courses:', textStatus, errorThrown);
            alert('Failed to load courses: ' + textStatus);
          }
        });
      }
  
      loadCourses();
  
      // Handle attendance form submission
      $('#attendance-form').submit(function(event) {
        event.preventDefault();
        const course = $('#course-select').val();
  
        // Example AJAX request to mark attendance
        $.ajax({
          url: '/api/attendance', // Your backend endpoint for marking attendance
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ course }),
          success: function(response) {
            console.log('Attendance marked:', response);
            alert('Attendance marked for ' + course);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to mark attendance:', textStatus, errorThrown);
            alert('Failed to mark attendance: ' + textStatus);
          }
        });
      });
    }
  
    // Handle add course form submission (admin dashboard)
    if ($('#add-course-form').length) {
      $('#add-course-form').submit(function(event) {
        event.preventDefault();
        const courseName = $('#course-name').val();
  
        // Example AJAX request to add a course
        $.ajax({
          url: '/api/add-course', // Your backend endpoint for adding courses
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ courseName }),
          success: function(response) {
            console.log('Course added:', response);
            alert('Course added: ' + courseName);
            
            // Optionally update UI or refresh course list
            loadCourses(); // Reload the course list if needed
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to add course:', textStatus, errorThrown);
            alert('Failed to add course: ' + textStatus);
          }
        });
      });
    }
  
    // Load attendance data on admin dashboard
    if ($('#attendance-table').length) {
      function loadAttendance() {
        // Example AJAX request to fetch attendance data
        $.ajax({
          url: '/api/attendance', // Your backend endpoint for fetching attendance records
          method: 'GET',
          success: function(response) {
            const attendanceRecords = response.records;
            const tableBody = $('#attendance-table tbody');
            tableBody.empty();
  
            attendanceRecords.forEach(record => {
              tableBody.append(`
                <tr>
                  <td>${record.course}</td>
                  <td>${record.student}</td>
                  <td>${record.status}</td>
                </tr>
              `);
            });
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to load attendance:', textStatus, errorThrown);
            alert('Failed to load attendance: ' + textStatus);
          }
        });
      }
  
      loadAttendance();
    }
  });
