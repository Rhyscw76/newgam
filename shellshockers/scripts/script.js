document.addEventListener('DOMContentLoaded', function() {
    // Report button click handler
    document.getElementById('report-game').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('.report-modal').style.display = 'block';
    });

    // Close button click handler
    document.querySelector('.report-modal-content span.close').addEventListener('click', function() {
        document.querySelector('.report-modal').style.display = 'none';
    });

    // Form submission handler
    document.querySelector('form#report-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get the game ID from the upvote button's data attribute
        let id = document.getElementById('upvote').getAttribute('data-id');
        
        // Get form data
        let formData = new FormData(document.getElementById('report-form'));
        let data = {
            type: formData.get(formData.keys().next().value),
            comment: formData.get([...formData.keys()][1]),
            action: 'report',
            id: id
        };
        
        // Send AJAX request
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/content/plugins/game-reports/action.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            //console.log(xhr.responseText);
        };
        
        // Convert data object to URL encoded string
        let formBody = [];
        for (let property in data) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        xhr.send(formBody);
        
        // Remove modal and show alert
        document.querySelector('.report-modal').remove();
        alert('Thanks for your report!');
    });
});