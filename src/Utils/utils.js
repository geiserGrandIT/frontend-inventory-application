export function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result); // Resolve with the data URL
        };
        reader.onerror = (error) => {
            reject(error); // Reject with any errors
        };
        reader.readAsDataURL(file);
    });
}