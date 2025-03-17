import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase
const SUPABASE_URL = "https://cwqhiwfmiymomtxgycwx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3cWhpd2ZtaXltb210eGd5Y3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTA3ODcsImV4cCI6MjA1NzcyNjc4N30.1fpWjVox5v2dAGM-MxXihwzdeuOb_Yxm-0Lr0Z8yLoU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("✅ pet.js is loaded!");

console.log("✅ supabase is loaded!");

let user = await getUser();
  if(!user){
      alert("You must be logged in to access this page.");
      window.location.href="index.html";
  }

async function getUser(){ //retrieves user id 
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        return null;
    }

    localStorage.setItem("auth_id", data.user.id);
    
    return data.user;

}

if (!user.id){
    console.log("No user ID");
}

// Fetch and display pets on page load
document.addEventListener("DOMContentLoaded", fetchPets);

// Form submission handler
document.getElementById("pet-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("🚀 Attempting to save pet...");

    // Get form values
    let auth_id = localStorage.getItem("auth_id");
    const petName = document.getElementById("pet-name").value.trim();
    const breed = document.getElementById("breed").value.trim();
    const size = document.getElementById("size").value;
    const age = document.getElementById("age").value.trim();
    const ageUnit = document.getElementById("age-unit").value;
    const diet = document.getElementById("diet").value.trim();

    // Check required fields
    if (!petName || !breed || !size || !age || !ageUnit || !diet) {
        alert("❌ Please fill in all fields.");
        return;
    }

    // Insert Pet Data into Supabase
    const { error: dbError } = await supabase
        .from("pets")
        .insert([
            {   
                auth_id: auth_id,
                pet_name: petName,
                breed: breed,
                size: size,
                age: parseInt(age),
                age_unit: ageUnit,
                diet: diet,
            }
        ]).eq("id").single();

    if (dbError) {
        console.error("❌ Database Error:", dbError.message);
        alert("❌ Failed to save pet details.");
        return;
    }

    console.log("✅ Pet saved successfully!");
    alert("✅ Pet saved successfully!");
    window.location.href="home.html";

    // Clear form and refresh displayed pets
    document.getElementById("pet-form").reset();
    fetchPets();
});

// Fetch and display pets
async function fetchPets() {
    console.log("🔄 Fetching pets...");

    const { data: pets, error } = await supabase
        .from("pets")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("❌ Fetch Error:", error.message);
        return;
    }

    console.log("✅ Pets fetched:", pets);
}

// Go back function
function goBack() {
    window.history.back();
}
