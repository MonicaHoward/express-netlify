const deleteButton = document.querySelector("#delete");


deleteButton.addEventListener("click", () => {
    fetch("/blogs", {
       method: 'delete',
       body: JSON.stringify({
        title: data-id
       }) 
    })
})
