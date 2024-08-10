$(document).ready(function() {
    async function loadCourses() {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/courses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const courseSelect = document.getElementById('course-select');
                const courseList = document.getElementById('course-list');

                courseSelect.innerHTML = '';
                courseList.innerHTML = '';

                result.courses.forEach(course => {
                    courseSelect.innerHTML += `<option value="${course._id}">${course.name}</option>`;
                    courseList.innerHTML += `<li>${course.name}</li>`;
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

    // Handle attendance form submission
    $('#attendance-form').submit(function(event) {
        event.preventDefault();
        const course = $('#course-select').val();
        markAttendance(course);
    });

    async function markAttendance(course) {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ course })
            });

            if (response.ok) {
                const result = await response.json();
                alert('Attendance marked for ' + course);
            } else {
                alert('Failed to mark attendance');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to mark attendance');
        }
    }

    // Load student data
    function loadStudentData() {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        $.ajax({
            url: 'http://localhost:5000/api/student',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
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
});
