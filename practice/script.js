// Initial console logs from your original script
try {
    let a = "Hello";
    console.log(a);
    console.log("world");
    // why(); // This will cause an error as intended in your original code
} catch (error) {
    console.error("Error Name: " + error.name);
    console.error("Error Message: " + error.message);
}

console.log("This code is working perfectly after getting an error");

async function load() {
    const url = "https://nithish2321.github.io/API/api.json";
    const row = document.getElementsByClassName("card-row")[0];
    const modal = document.getElementById("modal");
    const closeBtn = document.getElementById("close-btn");
    const filter = document.getElementById("category-filter");

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const allBlogs = data.blogs || [];
        const categories = data.meta.categories || [];

        // 1. Populate Category Filter Dropdown from Meta Data
        categories.forEach(cat => {
            let opt = document.createElement("option");
            opt.value = cat;
            opt.innerText = cat;
            filter.appendChild(opt);
        });

        // 2. Function to Render Cards
        const displayBlogs = (blogList) => {
            // Clear current cards before rendering new ones
            row.innerHTML = ""; 
            
            blogList.forEach((element) => {
                let card = document.createElement('div');
                card.className = 'card';
                
                // Determine Image Path based on Category
                let imgName = "";
                switch(element.category) {
                    case "Business":    imgName = "business.png"; break;
                    case "Culture":     imgName = "culture.jpg"; break;
                    case "Design":      imgName = "design.jpg"; break;
                    case "Travel":      imgName = "travel.png"; break;
                    case "Technology":  imgName = "technology.png"; break;
                    case "Science":     imgName = "science.png"; break;
                    case "Programming": imgName = "code.png"; break;
                    case "Lifestyle":   imgName = "lifestyle.png"; break;
                    case "Health":      imgName = "health.png"; break;
                    case "Environment": imgName = "envi.png"; break;
                    case "Education":   imgName = "ed.png"; break;
                    default:            imgName = "default.png";
                }

                card.innerHTML = `
                    <img src="./images/${imgName}" alt="${element.category}">
                    <h1>${element.title}</h1>
                `;

                // Modal Click Event to see Data
                card.onclick = () => {
                    document.getElementById("modal-title").innerText = element.title;
                    document.getElementById("modal-body").innerText = element.summary || "No summary available";
                    modal.style.display = "flex";
                };

                row.appendChild(card);
            });
        };

        // 3. Initial Load (Show all blogs)
        displayBlogs(allBlogs);

        // 4. Handle Category Filter Change
        filter.onchange = (e) => {
            const selected = e.target.value;
            if (selected === "All") {
                displayBlogs(allBlogs);
            } else {
                const filteredData = allBlogs.filter(blog => blog.category === selected);
                displayBlogs(filteredData);
            }
        };

        // 5. Modal Close Controls
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
        
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

    } catch (error) {
        console.error("Fetch Error Name: " + error.name);
        console.error("Fetch Error Message: " + error.message);
    }
}

// Initialize the page
load();