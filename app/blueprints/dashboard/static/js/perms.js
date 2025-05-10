document.addEventListener("DOMContentLoaded", function () { 
    
    document.querySelectorAll("li[data-roles]").forEach(li => {
        let allowedRoles = li.getAttribute("data-roles").replace(/'/g, '"');  
        allowedRoles = JSON.parse(allowedRoles); 
        
        if (!allowedRoles.some(role => userRoles.includes(role))) {
            li.remove();
        }
    });
})
