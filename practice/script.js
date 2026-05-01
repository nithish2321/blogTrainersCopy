try{
        let a = "Hello";
        console.log(a);
        why();
}catch(error){
        console.error("Error Name: "+error.name);
        console.error("Error Message: "+error.message);
}
    
console.log("This code is working perfectly after getting an error");


async function load(){ // Marker that tells i am going to run slowly
  const url = "https://nithish2321.github.io/API/api.json";
    
   try{
      let response = await fetch(url); //Pause for a time until it's loaded.
      if(response.ok){
          console.log("Loaded Successfully");
      }else{
          console.log("Not Loaded Successfully");
      }
      let data = await response.json();
       
      const blogs = [data.blogs || []];
       
      console.log(blogs);
       
      const main = document.getElementById("main");
       
      let count = 0;
      for(let i = 1; i <= 50; i++){
          let concat = `<div class ='card-row'>`;
          
          for(let j = 1; j <= 4; j++){
            concat += `<div class='card'>
            <h1>${count+1} ${blogs[0][count].title}</h1>
            <p>${blogs[0][count].summary}</p>
            </div>`;
            count++;
          }
          concat += `</div>`;
          
          main.innerHTML += concat;
      }
   }catch(error){
       console.error("Error Name: "+error.name);
       console.error("Error Message: "+error.message);
   }    
}

load();
