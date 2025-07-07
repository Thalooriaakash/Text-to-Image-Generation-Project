const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const API_KEY = "You need to get from hugging.com";

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/generate", async (req, res) => { 
    const prompt=req.query.prompt;
    console.log(prompt);
    const response = await fetch(
        "https://router.huggingface.co/nebius/v1/images/generations",
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                response_format: "b64_json",
                prompt: prompt,
                model: "black-forest-labs/flux-dev",
                 num_images: 2 ,
            }),
        }
    );

    const result = await response.json();
console.log(result);
     if (result?.data && result.data.length > 0) {
        const base64Image = result.data[0].b64_json;
        //const base64Image_1 = result.data[1].b64_json;
        const imageUrl = `data:image/png;base64,${base64Image}`;
       // const imageUrl_1 = `data:image/png;base64,${base64Image_1}`;
        
        
//Render the image or send URL <img src="${imageUrl_1}" alt="Generated Image" />

res.render("generate",{imageUrl});
        
        
    } else {
        res.send("No image generated");
    }
});
app.get("/prompt",(req,res)=>{
    res.render("prompt.ejs");
})
app.post("/prompt",(req,res)=>{
   const prompt=req.body.prompt;
   res.redirect(`/generate?prompt=${encodeURIComponent(prompt)}`);
})


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
