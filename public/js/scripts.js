$(document).ready(function() {
    // Handle registration form submission (for both student and admin)
    $('#registration-form').submit(function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        const fData = $("#registration-form").serializeArray();
        let formJson = {}
        fData.forEach((x,y)=>{
            formJson = {...formJson, [x.name]: x.value}
        });

        console.log(formJson);
        console.warn("Reg........");

        fetch('/api/auth/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formJson)
        }).then(res => res.json()).then(dat => {
            alert('Registration successful');
            window.location.href = "/login";
            console.log(dat, "From reg....");
        });
    });

    // Handle login form submission
    $('#login-form').submit(function(event) {
        event.preventDefault();
        const email = $('#login-email').val();
        const password = $('#login-password').val();
    
        $.ajax({
            url: '/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function(response) {
                if (response.token) {
                    localStorage.setItem('token', response.token); // Store the token
                    console.log('Token:', response.token); // Corrected variable name
                    alert('Login successful');
                    if (response.role === 'admin') {
                        window.location.href = '/admin-dashboard';
                    } else if (response.role === 'student') {
                        window.location.href = '/student-dashboard';
                    }
                } else {
                    alert('Login failed: No token received');
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
        $.ajax({
            url: '/api/logout',
            method: 'POST',
            success: function(response) {
                console.log('Logged out:', response);
                localStorage.removeItem('token'); // Remove the token
                alert('Logged out');
                window.location.href = '/'; // Redirect to landing page
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Logout failed:', textStatus, errorThrown);
                alert('Logout failed: ' + textStatus);
            }
        });
    });

    // Populate course list on student dashboard
    if ($('#course-select').length) {
        async function loadCourses() {
            try {
                const response = await fetch('/api/courses', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    const courseSelect = $('#course-select');
                    const courseList = $('#course-list');

                    courseSelect.empty();
                    courseList.empty();

                    result.courses.forEach(course => {
                        courseSelect.append(`<option value="${course._id}">${course.name}</option>`);
                        courseList.append(`<li>${course.name}</li>`);
                    });
                } else {
                    alert('Failed to load courses');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to load courses');
            }
        }

        loadCourses();
    }

    // Handle attendance form submission
    $('#attendance-form').submit(function(event) {
        event.preventDefault();
        const courseId = $('#course-select').val();
        markAttendance(courseId);
    });

    // Handle add course form submission (admin dashboard)
    if ($('#add-course-form').length) {
        $('#add-course-form').submit(function(event) {
            event.preventDefault();
            const courseName = $('#course-name').val();

            $.ajax({
                url: '/api/add-course',
                method: 'POST',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                data: JSON.stringify({ courseName }),
                success: function(response) {
                    console.log('Course added:', response);
                    alert('Course added: ' + courseName);
                    loadCourses(); // Reload the course list if needed
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Failed to add course:', textStatus, errorThrown);
                    alert('Failed to add course: ' + textStatus);
                }
            });
        });
    }

    // Load student data on dashboard
    if ($('#student-name').length && $('#student-photo').length) {
        function loadStudentData() {
            $.ajax({
                url: '/api/student',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                success: function(response) {
                    $('#student-name').text(response.name);
                    $('#student-photo').attr('src', response.photo);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Failed to load student data:', textStatus, errorThrown);
                    alert('Failed to load student data: ' + textStatus);
                }
            });
        }

        loadStudentData();
    }

    // Load attendance data on admin dashboard
    if ($('#attendance-table').length) {
        function loadAttendance() {
            $.ajax({
                url: '/api/attendance',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
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

    // Geolocation and attendance marking
    const classroomLocation = {
        latitude: 37.7749,  // Example latitude
        longitude: -122.4194 // Example longitude
    };
    
    const allowedRadius = 50; // 50 meters

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const toRadians = angle => angle * (Math.PI / 180);
        const R = 6371e3; // Radius of the Earth in meters
        const φ1 = toRadians(lat1);
        const φ2 = toRadians(lat2);
        const Δφ = toRadians(lat2 - lat1);
        const Δλ = toRadians(lon2 - lon1);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    async function markAttendance(courseId) {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;

                const response = await fetch('/api/attendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ course: courseId, latitude, longitude })
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Attendance marked successfully');
                } else {
                    alert('Failed to mark attendance');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error marking attendance');
            }
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }
});
