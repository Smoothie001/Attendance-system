$(document).ready(function() {
    // Handle add course form submission
    $('#add-course-form').submit(function(event) {
        event.preventDefault();
        const courseName = $('#course-name').val();

        $.ajax({
            url: '/api/admin/add-course',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: JSON.stringify({ courseName }),
            success: function(response) {
                console.log('Course added:', response);
                alert('Course added: ' + courseName);
                loadCourses(); // Reload the course list
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Failed to add course:', textStatus, errorThrown);
                alert('Failed to add course: ' + textStatus);
            }
        });
    });

    // Load courses
    async function loadCourses() {
        try {
            const response = await fetch('/api/courses', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const courseList = document.getElementById('course-list');

                courseList.innerHTML = '';

                result.courses.forEach(course => {
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

    // Load attendance data
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
});
